import React from 'react';
import Link from 'next/link';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { getSite } from '@/lib/content/site';

export default function Footer() {
  const site = getSite();
  const connect = [
    { href: site.links.github, label: 'GitHub', icon: Github },
    { href: site.links.linkedin, label: 'LinkedIn', icon: Linkedin },
    { href: `mailto:${site.contact.email}`, label: 'Email', icon: Mail },
  ].filter((link) => link.href);

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Column 1 - Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <span className="text-emerald-400 mr-2 text-lg">●</span>
              <span className="font-semibold text-white tracking-tight">{site.name}</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              {site.footer.tagline}
            </p>
          </div>

          {/* Column 2 - Navigation */}
          <div>
            <p className="text-white text-sm font-medium mb-4">Navigation</p>
            <ul className="space-y-3">
              {site.nav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Connect */}
          <div>
            <p className="text-white text-sm font-medium mb-4">Connect</p>
            <ul className="space-y-3">
              {connect.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-gray-500 hover:text-gray-300 text-sm flex items-center gap-2 transition-colors"
                  >
                    <Icon size={16} /> {label}
                  </a>
                </li>
              ))}
              <li className="text-gray-500 text-sm flex items-center gap-2 pt-1">
                <MapPin size={16} className="text-emerald-400/60" /> {site.contact.location}
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.06] mt-12 pt-8 text-center">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} {site.author} · {site.name}. Built with open Copernicus satellite data.
          </p>
        </div>
      </div>
    </footer>
  );
}
