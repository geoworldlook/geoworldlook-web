import { MetadataRoute } from 'next'
import { getSite } from '@/lib/content/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${getSite().url}/sitemap.xml`,
  }
}
