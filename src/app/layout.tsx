import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { getSite } from '@/lib/content/site';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const site = getSite();

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  authors: [{ name: site.author }],
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: site.url,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: site.name,
  url: site.url,
  description: site.description,
  inLanguage: 'en',
  author: {
    '@type': 'Person',
    name: site.author,
    url: `${site.url}/about`,
    jobTitle: 'Remote sensing and Earth observation',
    knowsLanguage: ['pl', 'en', 'fr', 'it'],
    sameAs: [site.links.github, site.links.linkedin].filter(Boolean),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0a0a0a] text-white antialiased`}>
        <script
          type="application/ld+json"
          // Dane strukturalne: łączą stronę z osobą i jej profilami (LinkedIn, GitHub) w wynikach wyszukiwania.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
