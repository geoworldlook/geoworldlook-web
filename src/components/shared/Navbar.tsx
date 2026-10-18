"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle
} from '@/components/ui/sheet';

type NavLink = { label: string; href: string };

/** Links and site name come from content/site.yaml via the marketing layout. */
export default function Navbar({ name, navLinks }: { name: string; navLinks: NavLink[] }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group transition-opacity hover:opacity-90">
          <span className="text-emerald-400 mr-2 text-lg">●</span>
          <span className="font-semibold text-white tracking-tight">{name}</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm transition-colors duration-200",
                  isActive(link.href)
                    ? "text-emerald-400 font-medium" 
                    : "text-gray-400 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="text-gray-400 hover:text-white p-1">
                <Menu size={20} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#0a0a0a] border-l border-white/[0.06] p-8">
              <SheetTitle className="text-white mb-8 flex items-center">
                <span className="text-emerald-400 mr-2">●</span>
                {name}
              </SheetTitle>
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => {
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-lg transition-colors duration-200",
                        isActive(link.href)
                          ? "text-emerald-400 font-medium" 
                          : "text-gray-400 hover:text-white"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
