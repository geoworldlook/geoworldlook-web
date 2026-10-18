import React from 'react';
import { Metadata } from 'next';
import { Mail, MapPin, Github, CheckCircle } from 'lucide-react';
import ContactForm from '@/features/contact/ContactForm';
import { getSite } from '@/lib/content/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch about Earth observation, satellite data validation or geospatial data science.'
};

export default function ContactPage() {
  const { contact, links } = getSite();
  const infoItems = [
    { icon: Mail, label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
    { icon: MapPin, label: 'Location', value: contact.location },
    ...(links.github ? [{ icon: Github, label: 'GitHub', value: links.github.replace(/^https:\/\//, ''), href: links.github }] : []),
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2">
          <header>
            <p className="text-emerald-400 text-xs uppercase tracking-widest mb-3">Contact</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Get in Touch</h1>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              {contact.intro}
            </p>
          </header>

          <div className="mt-8 space-y-6">
            {infoItems.map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-400/10 flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon className="text-emerald-400" size={16} />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-gray-500 hover:text-emerald-400 text-sm transition-colors">{item.value}</a>
                  ) : (
                    <p className="text-gray-500 text-sm">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-[#111] border border-white/[0.06] rounded-xl p-6">
            <p className="text-white font-medium text-sm mb-4">
              Happy to Talk About
            </p>
            <div className="space-y-3">
              {contact.topics.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="text-emerald-400" size={14} />
                  <span className="text-gray-400 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-[#111] border border-white/[0.06] rounded-xl p-6 md:p-8">
            <ContactForm formspreeId={contact.formspreeId} email={contact.email} />
          </div>
        </div>
      </div>
    </div>
  );
}
