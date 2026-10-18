import { z } from 'zod';
import { readYaml } from './files';

const linkSchema = z.object({ label: z.string(), href: z.string() });

const siteSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  title: z.string(),
  description: z.string(),
  author: z.string(),
  contact: z.object({
    email: z.string().email(),
    location: z.string(),
    formspreeId: z.string().default(''),
    intro: z.string(),
    topics: z.array(z.string()).default([]),
  }),
  links: z.object({
    github: z.string().default(''),
    linkedin: z.string().default(''),
  }),
  nav: z.array(linkSchema),
  footer: z.object({ tagline: z.string() }),
  home: z.object({
    hero: z.object({
      badge: z.string(),
      title: z.string(),
      titleAccent: z.string(),
      text: z.string(),
      primary: linkSchema,
      secondary: linkSchema,
    }),
    stats: z.array(z.object({ value: z.string(), label: z.string() })).max(3),
    map: z.object({
      enabled: z.boolean(),
      eyebrow: z.string(),
      title: z.string(),
      text: z.string(),
      geojson: z.string(),
      note: z.string().default(''),
    }),
    cta: z.object({ title: z.string(), text: z.string(), button: linkSchema }),
  }),
});

const aboutSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  intro: z.string(),
  background: z.array(z.string()),
  experience: z
    .array(z.object({ years: z.string(), role: z.string(), context: z.string().default('') }))
    .default([]),
  skills: z.array(z.object({ label: z.string(), tags: z.array(z.string()) })),
  availability: z.object({ title: z.string(), text: z.string(), button: linkSchema }),
});

export type Site = z.infer<typeof siteSchema>;
export type About = z.infer<typeof aboutSchema>;

let site: Site | undefined;

export function getSite(): Site {
  site ??= readYaml(siteSchema, 'site.yaml');
  return site;
}

export function getAbout(): About {
  return readYaml(aboutSchema, 'about.yaml');
}
