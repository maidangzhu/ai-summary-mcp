"use client"

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface MarkdownRendererProps {
  content: string
  className?: string
}

interface CodeBlockProps {
  children: string
  className?: string
  inline?: boolean
}

const CodeBlock = ({ children, className, inline }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false)
  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : ''

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (inline) {
    return (
      <code className="bg-secondary px-2 py-1 rounded text-sm font-mono text-primary">
        {children}
      </code>
    )
  }

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-md bg-secondary/80 hover:bg-secondary transition-colors opacity-0 group-hover:opacity-100 z-10"
        title="复制代码"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        PreTag="div"
        className="!bg-secondary !rounded-lg !text-sm"
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: 'hsl(var(--secondary))',
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  )
}

const MarkdownRenderer = ({ content, className }: MarkdownRendererProps) => {
  return (
    <div className={cn('markdown-content prose prose-invert max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 标题
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-primary mb-4 mt-6 pb-2 border-b border-border">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold text-primary mb-3 mt-5">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-medium text-primary mb-2 mt-4">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-medium text-primary mb-2 mt-3">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-sm font-medium text-primary mb-2 mt-3">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm font-medium text-muted-foreground mb-2 mt-3">
              {children}
            </h6>
          ),
          
          // 段落
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-foreground">
              {children}
            </p>
          ),
          
          // 列表
          ul: ({ children }) => (
            <ul className="mb-4 ml-6 space-y-1 list-disc text-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-6 space-y-1 list-decimal text-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-foreground">
              {children}
            </li>
          ),
          
          // 代码
          code: ({ children, className, ...props }) => {
            const inline = !className
            return (
              <CodeBlock 
                className={className} 
                inline={inline}
              >
                {String(children).replace(/\n$/, '')}
              </CodeBlock>
            )
          },
          
          // 引用
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4 bg-secondary/30 py-2 rounded-r">
              {children}
            </blockquote>
          ),
          
          // 链接
          a: ({ children, href }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              {children}
            </a>
          ),
          
          // 表格
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse border border-border rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-secondary">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-4 py-2 text-foreground">
              {children}
            </td>
          ),
          
          // 分隔线
          hr: () => (
            <hr className="my-8 border-border" />
          ),
          
          // 强调
          strong: ({ children }) => (
            <strong className="font-semibold text-primary">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-muted-foreground">
              {children}
            </em>
          ),
          
          // 删除线
          del: ({ children }) => (
            <del className="line-through text-muted-foreground">
              {children}
            </del>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownRenderer