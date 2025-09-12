"use client"

import React, { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import mermaid from 'mermaid'
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
  className?: string
}

interface MermaidDiagramProps {
  code: string
  id: string
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ code, id }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        if (containerRef.current) {
          containerRef.current.innerHTML = ''
          const { svg } = await mermaid.render(id + '-svg', code)
          containerRef.current.innerHTML = svg
        }
      } catch (error) {
        console.error('Mermaid rendering error:', error)
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="text-red-500 p-4 border border-red-300 rounded bg-red-50 dark:bg-red-900/20 dark:border-red-700">Mermaid 图表渲染失败: ${error}</div>`
        }
      }
    }
    renderDiagram()
  }, [code, id])

  return <div ref={containerRef} className="mermaid-container my-4 flex justify-center" />
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {
  const mermaidRef = useRef<number>(0)

  useEffect(() => {
    // 配置 mermaid 主题为深色模式
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      // themeVariables: {
      //   primaryColor: '#3b82f6',
      //   primaryTextColor: '#f8fafc',
      //   primaryBorderColor: '#1e40af',
      //   lineColor: '#64748b',
      //   sectionBkgColor: '#1e293b',
      //   altSectionBkgColor: '#334155',
      //   gridColor: '#475569',
      //   secondaryColor: '#6366f1',
      //   tertiaryColor: '#8b5cf6',
      //   background: '#0f172a',
      //   mainBkg: '#1e293b',
      //   secondBkg: '#334155',
      //   tertiaryBkg: '#475569'
      // },
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      fontSize: 14,
      darkMode: true
    })
  }, [])

  const renderMermaidDiagram = (code: string) => {
    const id = `mermaid-${mermaidRef.current++}`
    return <MermaidDiagram code={code} id={id} />
  }

  return (
    <div className={cn('prose prose-slate dark:prose-invert max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : ''
            const codeContent = String(children).replace(/\n$/, '')

            if (!inline && language === 'mermaid') {
              return renderMermaidDiagram(codeContent)
            }

            return !inline && match ? (
              <SyntaxHighlighter
                style={oneDark}
                language={language}
                PreTag="div"
                className="rounded-md"
                {...props}
              >
                {codeContent}
              </SyntaxHighlighter>
            ) : (
              <code className={cn('px-1.5 py-0.5 rounded bg-muted text-sm font-mono', className)} {...props}>
                {children}
              </code>
            )
          },
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mb-6 text-foreground border-b border-border pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mb-4 text-foreground border-b border-border pb-1">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mb-3 text-foreground">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold mb-2 text-foreground">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-base font-semibold mb-2 text-foreground">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm font-semibold mb-2 text-foreground">
              {children}
            </h6>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-foreground leading-relaxed">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 ml-6 list-disc text-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-6 list-decimal text-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="mb-1 text-foreground">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-muted-foreground bg-muted/50 py-2 rounded-r">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-border rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-muted/50">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left font-semibold text-foreground border-b border-border">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-foreground">
              {children}
            </td>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:text-primary/80 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="max-w-full h-auto rounded-lg shadow-md my-4"
            />
          ),
          hr: () => (
            <hr className="my-6 border-border" />
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-foreground">
              {children}
            </em>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownRenderer