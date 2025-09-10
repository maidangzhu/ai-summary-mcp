/*
  Warnings:

  - You are about to drop the column `actionItems` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `aiThoughtReasoning` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `alternatives` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `assumptions` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `businessConfidence` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `businessDomain` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `businessGoals` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `businessReasoning` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `challenges` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `complexity` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `customTags` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `decisions` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `filename` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `focusAreas` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `frameworks` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `implementationSteps` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `keyPoints` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `lessonsLearned` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `mainAchievements` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `marketContext` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `nextSteps` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `opportunities` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `outcomes` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `primaryTags` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `problemsSolved` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `reasoningProcess` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `recommendations` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `risks` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryStacks` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `solutionApproaches` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `solutionReasoning` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `subDomains` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `summaryReasoning` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `tagReasoning` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `techConfidence` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `techReasoning` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `technologies` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `tools` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `uncertainties` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `urgency` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `userTypes` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `valueProposition` on the `analysis_results` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."analysis_results" DROP COLUMN "actionItems",
DROP COLUMN "aiThoughtReasoning",
DROP COLUMN "alternatives",
DROP COLUMN "assumptions",
DROP COLUMN "businessConfidence",
DROP COLUMN "businessDomain",
DROP COLUMN "businessGoals",
DROP COLUMN "businessReasoning",
DROP COLUMN "challenges",
DROP COLUMN "complexity",
DROP COLUMN "customTags",
DROP COLUMN "decisions",
DROP COLUMN "filename",
DROP COLUMN "focusAreas",
DROP COLUMN "frameworks",
DROP COLUMN "implementationSteps",
DROP COLUMN "keyPoints",
DROP COLUMN "lessonsLearned",
DROP COLUMN "mainAchievements",
DROP COLUMN "marketContext",
DROP COLUMN "nextSteps",
DROP COLUMN "opportunities",
DROP COLUMN "outcomes",
DROP COLUMN "primaryTags",
DROP COLUMN "priority",
DROP COLUMN "problemsSolved",
DROP COLUMN "reasoningProcess",
DROP COLUMN "recommendations",
DROP COLUMN "risks",
DROP COLUMN "secondaryStacks",
DROP COLUMN "solutionApproaches",
DROP COLUMN "solutionReasoning",
DROP COLUMN "subDomains",
DROP COLUMN "summaryReasoning",
DROP COLUMN "tagReasoning",
DROP COLUMN "techConfidence",
DROP COLUMN "techReasoning",
DROP COLUMN "technologies",
DROP COLUMN "tools",
DROP COLUMN "uncertainties",
DROP COLUMN "urgency",
DROP COLUMN "userTypes",
DROP COLUMN "valueProposition",
ADD COLUMN     "business" TEXT,
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "title" TEXT;
