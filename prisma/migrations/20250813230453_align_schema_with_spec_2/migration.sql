/*
  Warnings:

  - The `movementPattern` column on the `Exercise` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `WorkoutTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Exercise" ADD COLUMN     "category" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "difficultyLevel" INTEGER,
ADD COLUMN     "equipmentNeeded" TEXT[],
ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "primaryMuscles" TEXT[],
ADD COLUMN     "secondaryMuscles" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "movementPattern",
ADD COLUMN     "movementPattern" TEXT[];

-- AlterTable
ALTER TABLE "public"."TemplateExercise" ADD COLUMN     "orderIndex" INTEGER,
ADD COLUMN     "restSeconds" INTEGER,
ADD COLUMN     "targetRepsMax" INTEGER,
ADD COLUMN     "targetRepsMin" INTEGER,
ADD COLUMN     "targetSets" INTEGER,
ADD COLUMN     "targetWeight" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."WorkoutTemplate" ADD COLUMN     "authorNotes" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "estimatedDuration" INTEGER,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "public"."UserPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "defaultWeightUnit" TEXT NOT NULL DEFAULT 'kg',

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_userId_key" ON "public"."UserPreferences"("userId");

-- CreateIndex
CREATE INDEX "BodyMeasurement_userId_idx" ON "public"."BodyMeasurement"("userId");

-- CreateIndex
CREATE INDEX "Workout_userId_idx" ON "public"."Workout"("userId");

-- CreateIndex
CREATE INDEX "WorkoutSet_workoutId_idx" ON "public"."WorkoutSet"("workoutId");

-- CreateIndex
CREATE INDEX "WorkoutSet_exerciseId_idx" ON "public"."WorkoutSet"("exerciseId");

-- AddForeignKey
ALTER TABLE "public"."UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
