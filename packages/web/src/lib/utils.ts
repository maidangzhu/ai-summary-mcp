import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const formatDate = (date: Date | string) => {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatRelativeTime = (date: Date | string) => {
  const d = new Date(date)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return '刚刚'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}小时前`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays}天前`
  }
  
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths}个月前`
  }
  
  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears}年前`
}

export const truncateText = (text: string, maxLength: number = 100) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const getStackColor = (stack: string) => {
  const colors: Record<string, string> = {
    '前端': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    '后端': 'bg-green-500/20 text-green-400 border-green-500/30',
    '移动端': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'DevOps': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    '数据库': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'AI/ML': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    '区块链': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    '游戏开发': 'bg-red-500/20 text-red-400 border-red-500/30',
    '嵌入式': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    '测试': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    '设计': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    '其他': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
  return colors[stack] || colors['其他']
}

export const getBusinessColor = (business: string) => {
  const colors: Record<string, string> = {
    '电商': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    '金融科技': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    '医疗健康': 'bg-red-500/20 text-red-400 border-red-500/30',
    '教育': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    '娱乐': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    '社交媒体': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    '生产力工具': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    '游戏': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    '物联网': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    '企业级': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    '创业': 'bg-lime-500/20 text-lime-400 border-lime-500/30',
    '开源': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    '其他': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
  return colors[business] || colors['其他']
}