import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { getSite } from '@/lib/content/site';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = getSite();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar name={site.name} navLinks={site.nav} />
      <main className="flex-grow min-h-screen">
        {children}
      </main>
      <Footer />
    </div>
  );
}
