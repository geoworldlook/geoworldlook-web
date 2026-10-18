import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Calendar, ChevronRight, CheckCircle, Github, MapPin, NotebookPen } from 'lucide-react';
import { getProject, getProjects } from '@/lib/content/projects';
import { getPostsForProject } from '@/lib/content/blog';
import ProjectIcon from '@/components/shared/ProjectIcon';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: 'Not Found' };
  return { title: project.title, description: project.tagline };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const posts = getPostsForProject(project.slug);
  const links = [
    { href: project.links.github, label: 'Code on GitHub', icon: Github },
    { href: project.links.colab, label: 'Open in Colab', icon: NotebookPen },
    { href: project.links.demo, label: 'Live demo', icon: ArrowRight },
  ].filter((link) => link.href);

  return (
    <article className="max-w-4xl mx-auto px-4 py-24">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-12">
        <Link href="/analyses" className="text-emerald-400 hover:underline transition-all">Analyses</Link>
        <ChevronRight size={14} />
        <span className="truncate">{project.title}</span>
      </div>

      <Link href="/analyses" className="inline-flex items-center gap-2 text-emerald-400 text-sm font-medium mb-8 hover:gap-3 transition-all">
        <ArrowLeft size={16} />
        Back to Analyses
      </Link>

      <header className="mb-12">
        <div className="w-12 h-12 rounded-xl bg-emerald-400/10 flex items-center justify-center mb-6">
          <ProjectIcon name={project.icon} className="text-emerald-400" size={24} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{project.title}</h1>
        <p className="text-xl text-gray-400 mb-6">{project.tagline}</p>
        <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500 font-mono uppercase tracking-widest">
          <span className="flex items-center gap-2">
            <Calendar size={14} className="text-emerald-400" />
            {new Date(project.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-2">
            <MapPin size={14} className="text-emerald-400" />
            {project.region}
          </span>
          <span className="text-emerald-400 border border-emerald-400/20 bg-emerald-400/5 px-2 py-0.5 rounded">{project.status}</span>
        </div>
      </header>

      {project.image && (
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex justify-center mb-12">
          <Image src={project.image} alt={project.title} width={1200} height={900} className="max-w-full h-auto rounded-lg" />
        </div>
      )}

      <div className="space-y-12">
        <p className="text-gray-300 text-lg leading-relaxed">{project.summary}</p>

        {project.highlights.length > 0 && (
          <section className="bg-[#111] border border-white/[0.06] rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">Key results</h2>
            <ul className="space-y-3">
              {project.highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="text-emerald-400 shrink-0 mt-1" size={14} />
                  <span className="text-gray-400 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-gray-300">{tag}</span>
            ))}
          </div>
        )}

        {links.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {links.map(({ href, label, icon: Icon }, idx) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={idx === 0
                  ? 'inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-3 rounded-lg transition-colors duration-200'
                  : 'inline-flex items-center gap-2 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white px-6 py-3 rounded-lg transition-colors duration-200'}
              >
                <Icon size={16} />
                {label}
              </a>
            ))}
          </div>
        )}

        {posts.length > 0 && (
          <section>
            <h2 className="text-white font-semibold text-xl mb-4">Articles about this project</h2>
            <div className="space-y-3">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex items-center justify-between gap-4 bg-[#111] border border-white/[0.06] hover:border-emerald-400/30 rounded-xl p-4 transition-colors">
                  <div>
                    <p className="text-white group-hover:text-emerald-400 transition-colors font-medium">{post.title}</p>
                    <p className="text-gray-500 text-sm line-clamp-1">{post.summary}</p>
                  </div>
                  <ArrowRight className="text-emerald-400 shrink-0" size={16} />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
