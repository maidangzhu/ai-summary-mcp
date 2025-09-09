/*
  Warnings:

  - You are about to drop the column `complexity` on the `problem_classifications` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedTime` on the `problem_classifications` table. All the data in the column will be lost.
  - You are about to drop the column `reasoning` on the `problem_classifications` table. All the data in the column will be lost.
  - You are about to drop the column `severity` on the `problem_classifications` table. All the data in the column will be lost.
  - You are about to drop the column `subCategory` on the `problem_classifications` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `problem_classifications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."problem_classifications" DROP COLUMN "complexity",
DROP COLUMN "estimatedTime",
DROP COLUMN "reasoning",
DROP COLUMN "severity",
DROP COLUMN "subCategory",
DROP COLUMN "tags";
