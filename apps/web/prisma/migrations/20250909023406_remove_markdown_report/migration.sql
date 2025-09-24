/*
  Warnings:

  - You are about to drop the column `markdownReport` on the `analysis_results` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."analysis_results" DROP COLUMN "markdownReport";
