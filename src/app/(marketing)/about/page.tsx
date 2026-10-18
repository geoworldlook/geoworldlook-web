import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAbout } from '@/lib/content/site';

export const metadata: Metadata = {
  title: 'About',
  description: 'Earth observation and geospatial data science: validated pipelines from open satellite data.'
};

export default function AboutPage() {
  const about = getAbout();

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <section className="py-16">
        <p className="text-emerald-400 text-xs uppercase tracking-widest mb-3">
          {about.eyebrow}
        </p>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          {about.title}
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
          {about.intro}
        </p>
      </section>

      <div className="border-t border-white/[0.06] my-2" />

      <section className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3 space-y-12">
            <div>
              <h2 className="text-white font-semibold text-xl mb-4">
                Background
              </h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                {about.background.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            {about.experience.length > 0 && (
              <div>
                <h2 className="text-white font-semibold text-xl mb-6">
                  Experience
                </h2>
                <div className="space-y-0">
                  {about.experience.map((exp) => (
                    <div key={`${exp.years}-${exp.role}`} className="relative pl-6 border-l border-white/[0.08] pb-8 last:pb-0">
                      <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-emerald-400 -translate-x-1/2" />
                      <p className="text-emerald-400 text-xs tracking-wider mb-1">{exp.years}</p>
                      <p className="text-white font-medium">{exp.role}</p>
                      <p className="text-gray-500 text-sm">{exp.context}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#111] border border-white/[0.06] rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">
                Technical Stack
              </h3>
              <div className="space-y-6">
                {about.skills.map((group) => (
                  <div key={group.label} className="mb-4 last:mb-0">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">{group.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {group.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-gray-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-500/5 border border-emerald-400/20 rounded-xl p-6 text-center">
              <p className="text-white font-medium mb-2">{about.availability.title}</p>
              <p className="text-gray-400 text-sm mb-4">{about.availability.text}</p>
              <Link href={about.availability.button.href} className="inline-block bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm px-5 py-2.5 rounded-lg transition-all">
                {about.availability.button.label}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
