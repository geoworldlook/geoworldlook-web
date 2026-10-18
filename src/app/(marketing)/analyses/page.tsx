import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, MapPin, Activity } from 'lucide-react';
import { getProjects } from '@/lib/content/projects';
import ProjectIcon from '@/components/shared/ProjectIcon';

export const metadata: Metadata = {
  title: 'Analyses',
  description: 'Earth-observation projects built on open data and validated against ground measurements.'
};

export default function AnalysesPage() {
  const projects = getProjects();

  return (
    <div className="max-w-6xl mx-auto px-4 py-24 space-y-12">
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">
          <Activity size={14} />
          Spatial Case Studies
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white">Geospatial Analyses Portfolio</h1>
        <p className="text-lg text-gray-400 leading-relaxed">
          Each project is a standalone module with its own pipeline, validation and documentation.
          All of them use open data, and every result is checked against independent ground measurements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <Card key={project.slug} className="group overflow-hidden bg-[#111] border-white/[0.06] hover:border-emerald-400/50 transition-all flex flex-col">
            <div className="relative h-56 overflow-hidden bg-[#0d0d0d]">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:32px_32px]">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-400/10 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                    <ProjectIcon name={project.icon} className="text-emerald-400" size={32} />
                  </div>
                </div>
              )}
              <div className="absolute top-4 right-4">
                <Badge className="bg-black/60 backdrop-blur-md text-emerald-400 border-emerald-400/20 capitalize">
                  {project.status}
                </Badge>
              </div>
            </div>
            <CardHeader className="flex-grow">
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(project.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {project.region}</span>
              </div>
              <CardTitle className="text-xl text-white group-hover:text-emerald-400 transition-colors line-clamp-2">{project.title}</CardTitle>
              <CardDescription className="line-clamp-3 leading-relaxed text-gray-400 mt-2">
                {project.tagline}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-0 pb-6">
              <Link href={`/analyses/${project.slug}`} className="w-full">
                <div className="flex items-center justify-center gap-2 text-sm font-bold text-emerald-400 transition-all py-2.5 border border-emerald-400/20 rounded-lg group-hover:bg-emerald-400/10">
                  View Case Study <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
