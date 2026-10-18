import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import type { PostCell, PostOutput } from '@/lib/content/blog';

function Markdown({ source }: { source: string }) {
  return (
    <div className="prose prose-invert prose-emerald max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {source}
      </ReactMarkdown>
    </div>
  );
}

function highlight(code: string, language: string): string {
  const lang = hljs.getLanguage(language) ? language : 'plaintext';
  return hljs.highlight(code, { language: lang }).value;
}

function Output({ output }: { output: PostOutput }) {
  switch (output.kind) {
    case 'image':
      return (
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:${output.mime};base64,${output.data}`}
            alt="Notebook figure"
            className="max-w-full h-auto rounded-lg shadow-2xl"
          />
        </div>
      );
    case 'html':
      return (
        <div
          className="notebook-html bg-white/[0.02] border border-white/5 rounded-xl p-4 overflow-x-auto text-sm text-gray-300"
          dangerouslySetInnerHTML={{ __html: output.html }}
        />
      );
    case 'markdown':
      return <Markdown source={output.source} />;
    case 'text':
      return (
        <pre className="bg-black/40 border-l-2 border-emerald-500/30 p-4 rounded-r-lg text-xs text-gray-400 overflow-x-auto font-mono">
          {output.text}
        </pre>
      );
  }
}

export default function NotebookCells({ cells }: { cells: PostCell[] }) {
  return (
    <div className="space-y-8">
      {cells.map((cell, idx) => {
        if (cell.kind === 'markdown') return <Markdown key={idx} source={cell.source} />;

        return (
          <div key={idx} className="space-y-4">
            {cell.showCode && (
              <div className="relative group">
                <div className="absolute top-3 right-3 text-[10px] font-mono text-gray-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  {cell.language}
                </div>
                <pre className="bg-[#0d0d0d] border border-white/5 rounded-xl p-6 overflow-x-auto">
                  <code
                    className={`hljs language-${cell.language} text-sm font-mono leading-relaxed !bg-transparent !p-0`}
                    dangerouslySetInnerHTML={{ __html: highlight(cell.source, cell.language) }}
                  />
                </pre>
              </div>
            )}
            {cell.outputs.length > 0 && (
              <div className="space-y-3">
                {cell.outputs.map((output, oIdx) => (
                  <Output key={oIdx} output={output} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
