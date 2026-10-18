import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import type { z } from 'zod';

/** Root of all editable site content (YAML settings, projects, blog notebooks). */
export const CONTENT_DIR = path.join(process.cwd(), 'content');

/** Files whose name starts with "_" are templates or notes and are never published. */
export function listContentFiles(subdir: string, extension: string): string[] {
  const dir = path.join(CONTENT_DIR, subdir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(extension) && !name.startsWith('_'))
    .sort();
}

export function readContentText(...segments: string[]): string {
  return fs.readFileSync(path.join(CONTENT_DIR, ...segments), 'utf8');
}

/** Parses a YAML file and validates it, failing the build with the file name and the broken field. */
export function readYaml<T extends z.ZodTypeAny>(schema: T, ...segments: string[]): z.infer<T> {
  const file = path.join('content', ...segments);
  const result = schema.safeParse(YAML.parse(readContentText(...segments)));
  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid content in ${file}:\n${problems}`);
  }
  return result.data;
}
