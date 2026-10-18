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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0a0a0a] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
