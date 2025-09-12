-- AlterTable
ALTER TABLE "public"."analysis_results" ADD COLUMN     "docId" TEXT;

-- CreateTable
CREATE TABLE "public"."docs" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "docs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."analysis_results" ADD CONSTRAINT "analysis_results_docId_fkey" FOREIGN KEY ("docId") REFERENCES "public"."docs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
