"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Globe, Github, Mail, Calendar, Code, Briefcase, Target } from "lucide-react"
import { ProfileData, StatsData } from "@/types"

interface ProfileCardProps {
  profile: ProfileData
  stats: StatsData
  className?: string
}

const ProfileCard = ({ profile, stats, className }: ProfileCardProps) => {
  return (
    <Card className={`w-full max-w-4xl mx-auto gradient-border glow-effect ${className}`}>
      <CardContent className="p-8 grid-background">
        {/* 头部信息 */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-2 ring-primary/20">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback className="text-2xl font-bold bg-linear-to-br from-primary/20 to-secondary/20">
              {profile.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                {profile.name}
              </h1>
              <p className="text-xl text-primary font-medium mb-3">
                {profile.title}
              </p>
              <p className="text-muted-foreground leading-relaxed max-w-2xl">
                {profile.bio}
              </p>
            </div>
            
            {/* 联系信息 */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {profile.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.website && (
                <a 
                  href={profile.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  <span>Website</span>
                </a>
              )}
              {profile.github && (
                <a 
                  href={profile.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </a>
              )}
              {profile.email && (
                <a 
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </a>
              )}
            </div>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        {/* 统计信息 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-blue-500/20 text-blue-400 pulse-glow">
              <Target className="h-6 w-6" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {stats.totalProblems}
            </div>
            <div className="text-sm text-muted-foreground">
              解决问题
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-green-500/20 text-green-400 pulse-glow">
              <Code className="h-6 w-6" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {stats.totalTechStacks}
            </div>
            <div className="text-sm text-muted-foreground">
              技术栈
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-purple-500/20 text-purple-400 pulse-glow">
              <Briefcase className="h-6 w-6" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {stats.totalBusinessDomains}
            </div>
            <div className="text-sm text-muted-foreground">
              业务领域
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-orange-500/20 text-orange-400 pulse-glow">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {stats.recentActivity}
            </div>
            <div className="text-sm text-muted-foreground">
              近期活动
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfileCard