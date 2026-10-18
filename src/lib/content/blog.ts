import YAML from 'yaml';
import { z } from 'zod';
import { listContentFiles, readContentText } from './files';

/**
 * Blog posts are Jupyter notebooks in content/blog.
 *
 * - The first markdown cell with a `title:` field holds the post metadata (YAML, with or without
 *   ``` or --- fences). A Colab badge cell before it is skipped.
 * - Code cells can start with Quarto-style options:
 *     #| echo: false     hide the code, keep the output
 *     #| output: false   keep the code, hide the output
 *     #| include: false  hide the whole cell
 *   Colab form cells (#@title) hide their code automatically.
 */

const metaSchema = z.object({
  title: z.string(),
  date: z.coerce.string(),
  summary: z.string().default(''),
  tags: z.array(z.coerce.string()).default([]),
  project: z.string().optional(),
  draft: z.boolean().default(false),
  readTime: z.string().optional(),
});

export type PostOutput =
  | { kind: 'image'; mime: string; data: string }
  | { kind: 'html'; html: string }
  | { kind: 'markdown'; source: string }
  | { kind: 'text'; text: string };

export type PostCell =
  | { kind: 'markdown'; source: string }
  | { kind: 'code'; source: string; language: string; showCode: boolean; outputs: PostOutput[] };

export type PostMeta = Omit<z.infer<typeof metaSchema>, 'readTime'> & { slug: string; readTime: string };
export type Post = PostMeta & { cells: PostCell[] };

interface RawCell {
  cell_type: string;
  source: string | string[];
  metadata?: { cellView?: string };
  attachments?: Record<string, Record<string, string>>;
  outputs?: RawOutput[];
}

interface RawOutput {
  output_type: string;
  name?: string;
  text?: string | string[];
  data?: Record<string, string | string[]>;
}

const join = (value: string | string[] | undefined) => (Array.isArray(value) ? value.join('') : value ?? '');

const isColabBadge = (cell: RawCell) =>
  cell.cell_type === 'markdown' && join(cell.source).includes('colab-badge.svg');

function parseMetadataCell(source: string): unknown {
  const body = source
    .trim()
    .replace(/^```(?:ya?ml)?\s*\n/i, '')
    .replace(/\n```\s*$/, '')
    .replace(/^---\s*\n/, '')
    .replace(/\n---\s*$/, '');
  try {
    return YAML.parse(body);
  } catch {
    return undefined;
  }
}

/** Replaces `attachment:image.png` links (images pasted into Colab markdown) with inline data URIs. */
function inlineAttachments(cell: RawCell): string {
  let source = join(cell.source);
  for (const [name, bundle] of Object.entries(cell.attachments ?? {})) {
    const [mime, data] = Object.entries(bundle)[0] ?? [];
    if (mime && data) source = source.replaceAll(`attachment:${name}`, `data:${mime};base64,${data}`);
  }
  return source;
}

function parseCodeOptions(source: string, isColabForm: boolean) {
  const options: Record<string, string> = {};
  const lines = source.split('\n').filter((line) => {
    const option = line.match(/^#\|\s*([\w-]+)\s*:\s*(.+?)\s*$/);
    if (option) {
      options[option[1]] = option[2];
      return false;
    }
    return !/^\s*#\s*@title\b/.test(line) && !/^\s*#\s*@markdown\b/.test(line);
  });
  return {
    code: lines.map((line) => line.replace(/\s*#\s*@param\b.*$/, '')).join('\n').trim(),
    include: options.include !== 'false',
    showCode: options.echo !== undefined ? options.echo !== 'false' : !isColabForm,
    showOutput: options.output !== 'false',
  };
}

function parseOutput(output: RawOutput): PostOutput | null {
  if (output.output_type === 'stream') {
    return output.name === 'stderr' ? null : { kind: 'text', text: join(output.text) };
  }
  const data = output.data;
  if (!data) return null;
  for (const mime of ['image/png', 'image/jpeg', 'image/gif']) {
    if (data[mime]) return { kind: 'image', mime, data: join(data[mime]).replace(/\s/g, '') };
  }
  if (data['image/svg+xml']) return { kind: 'html', html: join(data['image/svg+xml']) };
  if (data['text/html']) return { kind: 'html', html: join(data['text/html']) };
  if (data['text/markdown']) return { kind: 'markdown', source: join(data['text/markdown']) };
  if (data['text/plain']) return { kind: 'text', text: join(data['text/plain']) };
  return null;
}

function estimateReadTime(cells: PostCell[]): string {
  let words = 0;
  for (const cell of cells) {
    if (cell.kind === 'markdown') words += cell.source.split(/\s+/).length;
    else if (cell.showCode) words += cell.source.split('\n').length * 3;
  }
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function loadPost(file: string): Post {
  const slug = file.replace(/\.ipynb$/, '');
  const notebook = JSON.parse(readContentText('blog', file));
  const rawCells: RawCell[] = notebook.cells ?? [];
  const language: string =
    notebook.metadata?.language_info?.name ?? notebook.metadata?.kernelspec?.language ?? 'python';

  const metaIndex = rawCells.findIndex(
    (cell, index) => index < 3 && cell.cell_type === 'markdown' && !isColabBadge(cell) &&
      typeof (parseMetadataCell(join(cell.source)) as { title?: unknown })?.title === 'string',
  );
  if (metaIndex === -1) {
    throw new Error(`content/blog/${file}: the first markdown cell must contain the post metadata (title, date, summary, tags).`);
  }
  const parsed = metaSchema.safeParse(parseMetadataCell(join(rawCells[metaIndex].source)));
  if (!parsed.success) {
    const problems = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`content/blog/${file}: invalid metadata (${problems})`);
  }

  const cells: PostCell[] = [];
  rawCells.forEach((cell, index) => {
    if (index <= metaIndex && (index === metaIndex || isColabBadge(cell))) return;
    if (cell.cell_type === 'markdown') {
      const source = inlineAttachments(cell);
      if (source.trim()) cells.push({ kind: 'markdown', source });
    } else if (cell.cell_type === 'code') {
      const options = parseCodeOptions(join(cell.source), cell.metadata?.cellView === 'form');
      if (!options.include) return;
      const outputs = options.showOutput
        ? (cell.outputs ?? []).map(parseOutput).filter((o): o is PostOutput => o !== null)
        : [];
      if (!options.code && outputs.length === 0) return;
      cells.push({ kind: 'code', source: options.code, language, showCode: options.showCode && !!options.code, outputs });
    }
  });

  const { readTime, ...meta } = parsed.data;
  return { slug, ...meta, readTime: readTime ?? estimateReadTime(cells), cells };
}

const showDrafts = process.env.NODE_ENV !== 'production';

function loadPublishedPosts(): Post[] {
  return listContentFiles('blog', '.ipynb')
    .map(loadPost)
    .filter((post) => showDrafts || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPosts(): PostMeta[] {
  return loadPublishedPosts().map(({ cells: _cells, ...meta }) => meta);
}

export function getPost(slug: string): Post | undefined {
  return loadPublishedPosts().find((post) => post.slug === slug);
}

export function getPostsForProject(project: string): PostMeta[] {
  return getPosts().filter((post) => post.project === project);
}
