"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Tag, AlertCircle, Briefcase, ChevronDown, ChevronUp, FileText } from "lucide-react"
import { AnalysisResult } from "@/types"
import { formatRelativeTime, getStackColor, getBusinessColor, truncateText } from "@/lib/utils"
import { useState } from "react"
import DocDialog from "./doc-dialog"

interface AnalysisCardProps {
  analysis: AnalysisResult
  className?: string
}

const AnalysisCard = ({ analysis, className }: AnalysisCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [docDialogOpen, setDocDialogOpen] = useState(false)
  
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // 如果点击的是按钮或链接，不触发卡片点击
    if ((e.target as HTMLElement).closest('button, a')) {
      return
    }
    
    // 如果有文档，打开文档对话框
    if (analysis.doc || analysis.docId) {
      setDocDialogOpen(true)
    }
  }

  const handleOpenDoc = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDocDialogOpen(true)
  }



  return (
    <>
      <Card 
        className={`w-full card-hover border-l-4 border-l-primary/50 ${analysis.doc || analysis.docId ? 'cursor-pointer' : ''} ${className}`}
        onClick={handleCardClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-2">
                <h3 className="text-lg font-semibold text-foreground line-clamp-2 flex-1">
                  {analysis.title || '未命名分析'}
                </h3>
                {(analysis.doc || analysis.docId) && (
                  <button
                    onClick={handleOpenDoc}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors flex-shrink-0"
                    title="查看技术文档"
                  >
                    <FileText className="h-3 w-3" />
                    文档
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatRelativeTime(analysis.createdAt)}</span>
                </div>
                {analysis.problems.length > 0 && (
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{analysis.problems.length}个问题</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      
      <CardContent className="space-y-3">
        {/* 技术栈和业务标签 */}
        <div className="flex flex-wrap gap-2">
          {analysis.primaryStack && (
            <Badge className={getStackColor(analysis.primaryStack)}>
              <Tag className="h-3 w-3 mr-1" />
              {analysis.primaryStack}
            </Badge>
          )}
          {analysis.business && (
            <Badge className={getBusinessColor(analysis.business)}>
              <Briefcase className="h-3 w-3 mr-1" />
              {analysis.business}
            </Badge>
          )}
        </div>
        
        {/* 摘要 */}
        {analysis.summary && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isExpanded ? analysis.summary : truncateText(analysis.summary, 80)}
            </p>
            {analysis.summary.length > 80 && (
              <button
                onClick={handleToggleExpand}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3 w-3" />
                    收起
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3" />
                    展开详情
                  </>
                )}
              </button>
            )}
          </div>
        )}
        
        {/* 重要标签（只显示前3个） */}
        {analysis.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {analysis.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {analysis.tags.length > 3 && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                +{analysis.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        {/* 展开时显示更多详情 */}
        {isExpanded && (
          <div className="space-y-3 pt-2 border-t border-border">
            {/* 问题详情 */}
            {analysis.problems.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-foreground">问题分类</div>
                <div className="flex flex-wrap gap-2">
                  {analysis.problems.map((problem, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {problem.category}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* 所有标签 */}
            {analysis.tags.length > 3 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-foreground">所有标签</div>
                <div className="flex flex-wrap gap-1">
                  {analysis.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
    
    {/* 文档对话框 */}
    <DocDialog
      open={docDialogOpen}
      onOpenChange={setDocDialogOpen}
      doc={analysis.doc}
      docId={analysis.docId}
    />
  </>
  )
}

export default AnalysisCard