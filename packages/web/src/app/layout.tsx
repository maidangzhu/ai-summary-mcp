import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI协作档案 | AI Collaboration Archive',
  description: '展示AI协作过程中解决的问题和技术成长轨迹',
  keywords: ['AI', '协作', '档案', '技术', '成长', 'collaboration', 'archive'],
  authors: [{ name: 'zhujianye' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0f172a',
}

const RootLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <html lang="zh-CN" className="dark">
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}

export default RootLayout