import { z } from 'zod';
import { listContentFiles, readYaml } from './files';

const projectSchema = z.object({
  title: z.string(),
  tagline: z.string(),
  summary: z.string(),
  category: z.string(),
  icon: z.string().default('satellite'),
  region: z.string(),
  date: z.coerce.string(),
  status: z.enum(['active', 'completed', 'archived']),
  featured: z.boolean().default(false),
  order: z.number().default(100),
  image: z.string().default(''),
  highlights: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  links: z
    .object({ github: z.string().default(''), colab: z.string().default(''), demo: z.string().default('') })
    .default({}),
});

export type Project = z.infer<typeof projectSchema> & { slug: string };

export function getProjects(): Project[] {
  return listContentFiles('projects', '.yaml')
    .map((file) => ({ slug: file.replace(/\.yaml$/, ''), ...readYaml(projectSchema, 'projects', file) }))
    .sort((a, b) => a.order - b.order || b.date.localeCompare(a.date));
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((project) => project.slug === slug);
}
