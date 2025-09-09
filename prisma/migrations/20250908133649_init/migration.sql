-- CreateTable
CREATE TABLE "public"."analysis_results" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "filename" TEXT,
    "chatContent" TEXT NOT NULL,
    "primaryStack" TEXT,
    "secondaryStacks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "technologies" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "frameworks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tools" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "techConfidence" DOUBLE PRECISION,
    "techReasoning" TEXT,
    "businessDomain" TEXT,
    "subDomains" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "businessGoals" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "userTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "valueProposition" TEXT,
    "marketContext" TEXT,
    "businessConfidence" DOUBLE PRECISION,
    "businessReasoning" TEXT,
    "primaryTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "customTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "priority" TEXT,
    "urgency" TEXT,
    "complexity" TEXT,
    "tagReasoning" TEXT,
    "keyQuestions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "reasoningProcess" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "assumptions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "alternatives" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "recommendations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "uncertainties" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "aiThoughtReasoning" TEXT,
    "problemsSolved" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "solutionApproaches" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "implementationSteps" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "challenges" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "outcomes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lessonsLearned" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "solutionReasoning" TEXT,
    "keyPoints" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "mainAchievements" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "nextSteps" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "actionItems" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "decisions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "risks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "opportunities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "summaryReasoning" TEXT,
    "focusAreas" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "markdownReport" TEXT NOT NULL,

    CONSTRAINT "analysis_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."problem_classifications" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "analysisResultId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subCategory" TEXT,
    "severity" TEXT NOT NULL,
    "complexity" TEXT NOT NULL,
    "estimatedTime" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "reasoning" TEXT NOT NULL,

    CONSTRAINT "problem_classifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."problem_classifications" ADD CONSTRAINT "problem_classifications_analysisResultId_fkey" FOREIGN KEY ("analysisResultId") REFERENCES "public"."analysis_results"("id") ON DELETE CASCADE ON UPDATE CASCADE;
