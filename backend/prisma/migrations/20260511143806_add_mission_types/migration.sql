-- CreateEnum
CREATE TYPE "MissionType" AS ENUM ('STANDARD', 'WEEKLY_DAILY');

-- AlterTable
ALTER TABLE "Mission" ADD COLUMN     "bonusPercentage" INTEGER,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "requiredCompletions" INTEGER,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "type" "MissionType" NOT NULL DEFAULT 'STANDARD';

-- CreateTable
CREATE TABLE "MissionBonus" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "missionId" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MissionBonus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MissionBonus" ADD CONSTRAINT "MissionBonus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissionBonus" ADD CONSTRAINT "MissionBonus_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
