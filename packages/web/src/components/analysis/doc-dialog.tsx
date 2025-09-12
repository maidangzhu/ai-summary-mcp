"use client"

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import MarkdownRenderer from '@/components/markdown/markdown-renderer'
import { Doc } from '@/types'
import { Loader2, FileText, Calendar, AlertCircle } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

interface DocDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  docId?: string
  doc?: Doc
}

const DocDialog: React.FC<DocDialogProps> = ({ open, onOpenChange, docId, doc: initialDoc }) => {
  const [doc, setDoc] = useState<Doc | null>(initialDoc || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && docId && !initialDoc) {
      const fetchDoc = async () => {
        try {
          setLoading(true)
          setError(null)
          
          const response = await fetch(`/api/docs/${docId}`)
          if (!response.ok) {
            throw new Error('获取文档失败')
          }
          
          const data = await response.json()
          if (data.success) {
            setDoc(data.data)
          } else {
            throw new Error(data.message || '获取文档失败')
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : '获取文档失败')
        } finally {
          setLoading(false)
        }
      }

      fetchDoc()
    } else if (initialDoc) {
      setDoc(initialDoc)
    }
  }, [open, docId, initialDoc])

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // 清理状态
      if (!initialDoc) {
        setDoc(null)
        setError(null)
      }
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-semibold text-left">
                {loading ? '加载中...' : doc?.title || '文档详情'}
              </DialogTitle>
              {doc && (
                <DialogDescription className="text-left mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  创建于 {formatRelativeTime(doc.createdAt)}
                  {doc.updatedAt !== doc.createdAt && (
                    <span>• 更新于 {formatRelativeTime(doc.updatedAt)}</span>
                  )}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>加载文档中...</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <p className="text-destructive mb-4">{error}</p>
                <button
                  onClick={() => {
                    if (docId && !initialDoc) {
                      // 重新获取
                      setError(null)
                      const fetchDoc = async () => {
                        try {
                          setLoading(true)
                          const response = await fetch(`/api/docs/${docId}`)
                          if (!response.ok) {
                            throw new Error('获取文档失败')
                          }
                          const data = await response.json()
                          if (data.success) {
                            setDoc(data.data)
                          } else {
                            throw new Error(data.message || '获取文档失败')
                          }
                        } catch (err) {
                          setError(err instanceof Error ? err.message : '获取文档失败')
                        } finally {
                          setLoading(false)
                        }
                      }
                      fetchDoc()
                    }
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  重试
                </button>
              </div>
            </div>
          ) : doc ? (
            <div className="py-4">
              <MarkdownRenderer 
                content={doc.content} 
                className="max-w-none"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>暂无文档内容</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DocDialog