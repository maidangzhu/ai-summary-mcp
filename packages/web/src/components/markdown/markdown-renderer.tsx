"use client"

import { useEffect, useRef, useState } from "react"
import MarkdownIt from "markdown-it"
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
  className?: string
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight: (str: string, lang: string): string => {
    const escapedStr = md.utils.escapeHtml(str)
    return `<pre class="bg-slate-900 text-slate-100 p-4 rounded-md overflow-x-auto"><code class="language-${lang || "text"}">${escapedStr}</code></pre>`
  },
})

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mermaidLoaded, setMermaidLoaded] = useState(false)

  useEffect(() => {
    const loadMermaid = async () => {
      try {
        if (typeof window !== "undefined" && !window.mermaid) {
          const mermaidModule = await import("mermaid")
          window.mermaid = mermaidModule.default

          window.mermaid.initialize({
            startOnLoad: false,
            theme: "dark",
            securityLevel: "loose",
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
            fontSize: 14,
            darkMode: true
          })
        }
        setMermaidLoaded(true)
      } catch (error) {
        console.error("Failed to load mermaid:", error)
        setMermaidLoaded(true) // 继续渲染，即使 mermaid 加载失败
      }
    }

    loadMermaid()
  }, [])

  useEffect(() => {
    if (!containerRef.current || !mermaidLoaded) return

    const renderContent = async () => {
      try {
        // 预处理 mermaid 代码块
        let processedContent = content
        const mermaidBlocks: string[] = []

        // 提取 mermaid 代码块
        processedContent = content.replace(/```mermaid\n([\s\S]*?)\n```/g, (match, code) => {
          const index = mermaidBlocks.length
          mermaidBlocks.push(code.trim())
          return `<div class="mermaid-placeholder" data-index="${index}"></div>`
        })

        // 使用 markdown-it 渲染其他内容
        const html = md.render(processedContent)

        if (containerRef.current) {
          containerRef.current.innerHTML = html

          // 应用样式到渲染的 HTML 元素
          const container = containerRef.current
          
          // 标题样式
          const h1Elements = container.querySelectorAll('h1')
          h1Elements.forEach(el => {
            el.className = 'text-3xl font-bold mb-6 text-foreground border-b border-border pb-2'
          })
          
          const h2Elements = container.querySelectorAll('h2')
          h2Elements.forEach(el => {
            el.className = 'text-2xl font-semibold mb-4 text-foreground border-b border-border pb-1'
          })
          
          const h3Elements = container.querySelectorAll('h3')
          h3Elements.forEach(el => {
            el.className = 'text-xl font-semibold mb-3 text-foreground'
          })
          
          const h4Elements = container.querySelectorAll('h4')
          h4Elements.forEach(el => {
            el.className = 'text-lg font-semibold mb-2 text-foreground'
          })
          
          const h5Elements = container.querySelectorAll('h5')
          h5Elements.forEach(el => {
            el.className = 'text-base font-semibold mb-2 text-foreground'
          })
          
          const h6Elements = container.querySelectorAll('h6')
          h6Elements.forEach(el => {
            el.className = 'text-sm font-semibold mb-2 text-foreground'
          })
          
          // 段落样式
          const pElements = container.querySelectorAll('p')
          pElements.forEach(el => {
            el.className = 'mb-4 text-foreground leading-relaxed'
          })
          
          // 列表样式
          const ulElements = container.querySelectorAll('ul')
          ulElements.forEach(el => {
            el.className = 'mb-4 ml-6 list-disc text-foreground'
          })
          
          const olElements = container.querySelectorAll('ol')
          olElements.forEach(el => {
            el.className = 'mb-4 ml-6 list-decimal text-foreground'
          })
          
          const liElements = container.querySelectorAll('li')
          liElements.forEach(el => {
            el.className = 'mb-1 text-foreground'
          })
          
          // 引用样式
          const blockquoteElements = container.querySelectorAll('blockquote')
          blockquoteElements.forEach(el => {
            el.className = 'border-l-4 border-primary pl-4 my-4 italic text-muted-foreground bg-muted/50 py-2 rounded-r'
          })
          
          // 表格样式
          const tableElements = container.querySelectorAll('table')
          tableElements.forEach(el => {
            const wrapper = document.createElement('div')
            wrapper.className = 'overflow-x-auto my-4'
            el.parentNode?.insertBefore(wrapper, el)
            wrapper.appendChild(el)
            el.className = 'min-w-full border border-border rounded-lg'
          })
          
          const theadElements = container.querySelectorAll('thead')
          theadElements.forEach(el => {
            el.className = 'bg-muted'
          })
          
          const tbodyElements = container.querySelectorAll('tbody')
          tbodyElements.forEach(el => {
            el.className = 'divide-y divide-border'
          })
          
          const trElements = container.querySelectorAll('tr')
          trElements.forEach(el => {
            el.className = 'hover:bg-muted/50'
          })
          
          const thElements = container.querySelectorAll('th')
          thElements.forEach(el => {
            el.className = 'px-4 py-2 text-left font-semibold text-foreground border-b border-border'
          })
          
          const tdElements = container.querySelectorAll('td')
          tdElements.forEach(el => {
            el.className = 'px-4 py-2 text-foreground'
          })
          
          // 链接样式
          const aElements = container.querySelectorAll('a')
          aElements.forEach(el => {
            el.className = 'text-primary hover:text-primary/80 underline'
            el.setAttribute('target', '_blank')
            el.setAttribute('rel', 'noopener noreferrer')
          })
          
          // 图片样式
          const imgElements = container.querySelectorAll('img')
          imgElements.forEach(el => {
            el.className = 'max-w-full h-auto rounded-lg shadow-md my-4'
          })
          
          // 分割线样式
          const hrElements = container.querySelectorAll('hr')
          hrElements.forEach(el => {
            el.className = 'my-6 border-border'
          })
          
          // 强调样式
          const strongElements = container.querySelectorAll('strong')
          strongElements.forEach(el => {
            el.className = 'font-semibold text-foreground'
          })
          
          const emElements = container.querySelectorAll('em')
          emElements.forEach(el => {
            el.className = 'italic text-foreground'
          })
          
          // 内联代码样式
          const codeElements = container.querySelectorAll('code:not(pre code)')
          codeElements.forEach(el => {
            el.className = 'px-1.5 py-0.5 rounded bg-muted text-sm font-mono'
          })

          // 渲染 mermaid 图表
          if (window.mermaid && mermaidBlocks.length > 0) {
            const placeholders = container.querySelectorAll(".mermaid-placeholder")

            for (let i = 0; i < placeholders.length; i++) {
              const placeholder = placeholders[i]
              const index = Number.parseInt(placeholder.getAttribute("data-index") || "0")
              const code = mermaidBlocks[index]

              if (code) {
                try {
                  const { svg } = await window.mermaid.render(`mermaid-${Date.now()}-${i}`, code)
                  placeholder.innerHTML = svg
                  placeholder.className = "mermaid-container my-4 flex justify-center"
                } catch (mermaidError) {
                  console.error("Mermaid rendering error:", mermaidError)
                  placeholder.innerHTML = `<div class="text-red-500 p-4 border border-red-300 rounded bg-red-50 dark:bg-red-900/20 dark:border-red-700">Mermaid 图表渲染失败: ${mermaidError}</div>`
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Markdown rendering error:", error)
        if (containerRef.current) {
          containerRef.current.innerHTML = `<p class="text-destructive">渲染错误: ${error}</p>`
        }
      }
    }

    renderContent()
  }, [content, mermaidLoaded])

  return <div ref={containerRef} className={cn('prose prose-slate dark:prose-invert max-w-none', className)} />
}

declare global {
  interface Window {
    mermaid: any
  }
}

export default MarkdownRenderer