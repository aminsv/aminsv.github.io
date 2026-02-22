import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

type AdminMarkdownEditorProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minRows?: number
}

export function AdminMarkdownEditor({
  value,
  onChange,
  placeholder = 'Markdown…',
  minRows = 8,
}: AdminMarkdownEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')

  return (
    <div className="rounded-md border border-slate-700 bg-slate-950 overflow-hidden">
      <div className="flex border-b border-slate-700">
        <button
          type="button"
          onClick={() => setMode('edit')}
          className={`px-3 py-1.5 text-xs font-medium ${
            mode === 'edit'
              ? 'bg-slate-800 text-slate-100 border-b border-emerald-500 -mb-px'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => setMode('preview')}
          className={`px-3 py-1.5 text-xs font-medium ${
            mode === 'preview'
              ? 'bg-slate-800 text-slate-100 border-b border-emerald-500 -mb-px'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Preview
        </button>
      </div>
      {mode === 'edit' ? (
        <textarea
          rows={minRows}
          placeholder={placeholder}
          className="w-full resize-y min-h-[8rem] rounded-b-md border-0 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
        />
      ) : (
        <div className="min-h-[8rem] rounded-b-md px-3 py-2 text-sm text-slate-300 max-w-none focus:outline-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="mt-2 mb-1 text-base font-semibold text-slate-100">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="mt-2 mb-1 text-sm font-semibold text-slate-200">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="mt-1.5 mb-0.5 text-sm font-medium text-slate-200">
                  {children}
                </h3>
              ),
              p: ({ children }) => <p className="my-1">{children}</p>,
              ul: ({ children }) => (
                <ul className="my-1 list-disc pl-5">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="my-1 list-decimal pl-5">{children}</ol>
              ),
              li: ({ children }) => <li className="my-0.5">{children}</li>,
              code: ({ className, children, ...props }) => (
                <code
                  className="rounded bg-slate-800 px-1 py-0.5 text-xs"
                  {...props}
                >
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="my-2 overflow-x-auto rounded bg-slate-800 p-2 text-xs">
                  {children}
                </pre>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-slate-600 pl-3 my-1 text-slate-400">
                  {children}
                </blockquote>
              ),
            }}
          >
            {value || '_No content_'}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
}
