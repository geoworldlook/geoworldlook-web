import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, ChevronRight, FolderGit2 } from 'lucide-react';
import { getPost, getPosts } from '@/lib/content/blog';
import { getProject } from '@/lib/content/projects';
import NotebookCells from '@/features/blog/NotebookCells';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: 'Not Found' };
  return { title: post.title, description: post.summary };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const project = post.project ? getProject(post.project) : undefined;

  return (
    <article className="max-w-4xl mx-auto px-4 py-24">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-12">
        <Link href="/blog" className="text-emerald-400 hover:underline transition-all">Blog</Link>
        <ChevronRight size={14} />
        <span className="truncate">{post.title}</span>
      </div>

      <Link href="/blog" className="inline-flex items-center gap-2 text-emerald-400 text-sm font-medium mb-8 hover:gap-3 transition-all">
        <ArrowLeft size={16} />
        Back to Blog
      </Link>

      <header className="mb-16">
        {post.draft && (
          <span className="inline-block mb-4 text-[10px] uppercase tracking-widest text-amber-400 border border-amber-400/30 bg-amber-400/5 px-2 py-1 rounded">
            Draft · visible only in local preview
          </span>
        )}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500 font-mono uppercase tracking-widest">
          <span className="flex items-center gap-2">
            <Calendar size={14} className="text-emerald-400" />
            {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-2">
            <Clock size={14} className="text-emerald-400" />
            {post.readTime}
          </span>
          {project && (
            <Link href={`/analyses/${project.slug}`} className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
              <FolderGit2 size={14} className="text-emerald-400" />
              {project.title}
            </Link>
          )}
        </div>
      </header>

      <NotebookCells cells={post.cells} />
    </article>
  );
}
