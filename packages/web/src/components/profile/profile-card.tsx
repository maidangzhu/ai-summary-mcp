"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ProfileData } from "@/types"

interface ProfileCardProps {
  profile: ProfileData
  className?: string
}

const ProfileCard = ({ profile, className }: ProfileCardProps) => {
  return (
    <Card className={`w-full mx-auto border border-gray-200 ${className}`}>
      <CardContent className="p-8">
        {/* 头部信息 */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-2 ring-gray-300">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback className="text-2xl font-bold bg-gray-100">
              {profile.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold  mb-2">
                {profile.name}
              </h1>
              <p className="text-xl font-medium mb-3">
                {profile.title}
              </p>
              <p className="text-muted-foreground leading-relaxed max-w-2xl">
                {profile.bio}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfileCard