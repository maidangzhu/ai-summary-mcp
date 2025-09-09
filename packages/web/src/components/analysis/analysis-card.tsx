"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, Tag, Brain, AlertCircle, CheckCircle, Briefcase } from "lucide-react"
import { AnalysisResult } from "@/types"
import { formatRelativeTime, getStackColor, getBusinessColor, truncateText } from "@/lib/utils"
import { useState } from "react"

interface AnalysisCardProps {
  analysis: AnalysisResult
  className?: string
}

const AnalysisCard = ({ analysis, className }: AnalysisCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <Card className={`w-full card-hover line-accent border-l-4 border-l-primary/50 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
              {analysis.title || '未命名分析'}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatRelativeTime(analysis.createdAt)}</span>
            </div>
          </div>
          
          {/* 状态指示器 */}
          <div className="flex items-center gap-2">
            {analysis.problems.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-green-400">
                <CheckCircle className="h-3 w-3" />
                <span>{analysis.problems.length}个问题</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
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
              {isExpanded ? analysis.summary : truncateText(analysis.summary, 150)}
            </p>
            {analysis.summary.length > 150 && (
              <button
                onClick={handleToggleExpand}
                className="text-xs text-primary hover:underline"
              >
                {isExpanded ? '收起' : '展开'}
              </button>
            )}
          </div>
        )}
        
        {/* AI思考要点 */}
        {analysis.keyQuestions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Brain className="h-4 w-4 text-purple-400" />
              <span>AI思考要点</span>
            </div>
            <div className="space-y-1">
              {analysis.keyQuestions.slice(0, isExpanded ? undefined : 2).map((question, index) => (
                <div key={index} className="text-sm text-muted-foreground pl-6 relative">
                  <div className="absolute left-2 top-2 w-1 h-1 bg-purple-400 rounded-full" />
                  {question}
                </div>
              ))}
              {analysis.keyQuestions.length > 2 && !isExpanded && (
                <button
                  onClick={handleToggleExpand}
                  className="text-xs text-primary hover:underline pl-6"
                >
                  还有 {analysis.keyQuestions.length - 2} 个要点...
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* 标签 */}
        {analysis.tags.length > 0 && (
          <div className="space-y-2">
            <Separator />
            <div className="flex flex-wrap gap-1">
              {analysis.tags.slice(0, isExpanded ? undefined : 5).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {analysis.tags.length > 5 && !isExpanded && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  +{analysis.tags.length - 5}
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* 问题分类 */}
        {analysis.problems.length > 0 && (
          <div className="space-y-2">
            <Separator />
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <AlertCircle className="h-4 w-4 text-orange-400" />
              <span>问题分类</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {analysis.problems.slice(0, isExpanded ? undefined : 2).map((problem, index) => (
                <div key={index} className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {problem.category}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        problem.severity === '高' ? 'border-red-500/30 text-red-400' :
                        problem.severity === '中' ? 'border-yellow-500/30 text-yellow-400' :
                        'border-green-500/30 text-green-400'
                      }`}
                    >
                      {problem.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    复杂度: {problem.complexity} | 预估时间: {problem.estimatedTime}
                  </p>
                </div>
              ))}
              {analysis.problems.length > 2 && !isExpanded && (
                <button
                  onClick={handleToggleExpand}
                  className="p-3 rounded-lg bg-secondary/30 border border-dashed border-border text-sm text-primary hover:bg-secondary/50 transition-colors"
                >
                  查看更多 {analysis.problems.length - 2} 个问题
                </button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AnalysisCard