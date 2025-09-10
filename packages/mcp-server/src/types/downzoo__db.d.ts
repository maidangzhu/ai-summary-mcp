declare module '@downzoo/db' {
  import type { PrismaClient } from '@prisma/client'
  const prisma: PrismaClient
  export default prisma
}

