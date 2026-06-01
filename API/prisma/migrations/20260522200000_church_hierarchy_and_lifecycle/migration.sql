-- CreateEnum
CREATE TYPE "ChurchType" AS ENUM ('HEADQUARTER', 'BRANCH');

-- CreateEnum
CREATE TYPE "ChurchStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DELETED');

-- AlterTable
ALTER TABLE "churchs" ADD COLUMN     "deactivatedAt" TIMESTAMP(3),
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "parentChurchId" INTEGER,
ADD COLUMN     "status" "ChurchStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "type" "ChurchType" NOT NULL DEFAULT 'BRANCH';

-- AddForeignKey
ALTER TABLE "churchs" ADD CONSTRAINT "churchs_parentChurchId_fkey" FOREIGN KEY ("parentChurchId") REFERENCES "churchs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

