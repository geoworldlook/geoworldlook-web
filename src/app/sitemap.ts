import { MetadataRoute } from 'next'
import { getSite } from '@/lib/content/site'
import { getProjects } from '@/lib/content/projects'
import { getPosts } from '@/lib/content/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const { url, nav } = getSite()
  return [
    { url, changeFrequency: 'weekly', priority: 1 },
    ...nav.map((link) => ({ url: `${url}${link.href}`, changeFrequency: 'weekly' as const, priority: 0.7 })),
    ...getProjects().map((project) => ({ url: `${url}/analyses/${project.slug}`, lastModified: project.date, priority: 0.8 })),
    ...getPosts().map((post) => ({ url: `${url}/blog/${post.slug}`, lastModified: post.date, priority: 0.6 })),
  ]
}
