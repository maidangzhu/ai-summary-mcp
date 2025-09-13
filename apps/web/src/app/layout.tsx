import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'document | 档案',
  description: '让你的努力有迹可循',
  keywords: ['档案', '技术', '成长', 'archive', 'effort', 'trace', 'bug', 'rolution'],
  authors: [{ name: 'zhujianye' }],
  viewport: 'width=device-width, initial-scale=1',
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