"use client"

import { useEffect, useState } from 'react'
import ProfileCard from '@/components/profile/profile-card'
import AnalysisCard from '@/components/analysis/analysis-card'
import { AnalysisResult, ProfileData, StatsData } from '@/types'
import { Loader2, Search, Filter } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

// Mock数据
const mockProfile: ProfileData = {
  name: 'qwer',
  title: 'AI协作开发者 & 全栈工程师',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  bio: '专注于AI协作开发，通过智能工具提升开发效率。热爱技术分享，致力于将AI与传统开发流程深度融合，创造更高效的开发体验。',
  location: '中国 · 深圳',
  website: 'https://example.com',
  github: 'https://github.com/zhujianye',
  email: 'zhujianye@example.com'
}

const HomePage = () => {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTechStack, setSelectedTechStack] = useState<string | null>(null)
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // 获取统计数据
        const statsResponse = await fetch('/api/stats')
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          if (statsData.success) {
            setStats({
              totalProblems: statsData.data.overview.totalProblems,
              totalTechStacks: statsData.data.overview.totalTechStacks,
              totalBusinessDomains: statsData.data.overview.totalBusinessDomains,
              recentActivity: statsData.data.overview.recentActivity
            })
          }
        }
        
        // 获取分析结果
        const params = new URLSearchParams({
          limit: '20',
          ...(searchTerm && { search: searchTerm }),
          ...(selectedTechStack && { techStack: selectedTechStack }),
          ...(selectedBusiness && { business: selectedBusiness })
        })
        
        const analysisResponse = await fetch(`/api/analysis?${params}`)
        if (analysisResponse.ok) {
          const analysisData = await analysisResponse.json()
          if (analysisData.success) {
            setAnalysisResults(analysisData.data.results)
          }
        }
        
      } catch (err) {
        setError('加载数据失败，请稍后重试')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchTerm, selectedTechStack, selectedBusiness])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleTechStackFilter = (stack: string) => {
    setSelectedTechStack(selectedTechStack === stack ? null : stack)
  }

  const handleBusinessFilter = (business: string) => {
    setSelectedBusiness(selectedBusiness === business ? null : business)
  }

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>加载中...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              重新加载
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* 个人资料卡片 */}
        {/* {stats && (
          <ProfileCard 
            profile={mockProfile} 
            stats={stats}
            className="mb-8"
          />
        )} */}
        
        {/* 搜索和筛选 */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* 搜索框 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="搜索分析结果..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                />
              </div>
              
              {/* 筛选标签 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">技术栈筛选:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['前端', '后端', 'AI/ML', 'DevOps', '数据库'].map((stack) => (
                    <Badge
                      key={stack}
                      variant={selectedTechStack === stack ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-primary/20 transition-colors"
                      onClick={() => handleTechStackFilter(stack)}
                    >
                      {stack}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">业务领域筛选:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['电商', '金融科技', '教育', '生产力工具', '开源'].map((business) => (
                    <Badge
                      key={business}
                      variant={selectedBusiness === business ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-primary/20 transition-colors"
                      onClick={() => handleBusinessFilter(business)}
                    >
                      {business}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* 分析结果列表 */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              AI协作分析记录
            </h2>
            <span className="text-sm text-muted-foreground">
              共 {analysisResults.length} 条记录
            </span>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>加载中...</span>
              </div>
            </div>
          ) : analysisResults.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground mb-4">
                  {searchTerm || selectedTechStack || selectedBusiness 
                    ? '没有找到匹配的分析结果' 
                    : '暂无分析记录'}
                </p>
                {(searchTerm || selectedTechStack || selectedBusiness) && (
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedTechStack(null)
                      setSelectedBusiness(null)
                    }}
                    className="text-primary hover:underline"
                  >
                    清除筛选条件
                  </button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {analysisResults.map((analysis) => (
                <AnalysisCard 
                  key={analysis.id} 
                  analysis={analysis}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage