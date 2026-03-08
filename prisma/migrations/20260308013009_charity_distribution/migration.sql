-- CreateEnum
CREATE TYPE "CharityPurpose" AS ENUM ('FOOD', 'MEDICINE', 'EDUCATION', 'HOUSING', 'OTHER');

-- CreateTable
CREATE TABLE "CharityDistribution" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "charityType" "DonationType" NOT NULL,
    "purpose" "CharityPurpose" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "notes" TEXT,
    "createdBy" INTEGER,
    "distributionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CharityDistribution_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CharityDistribution" ADD CONSTRAINT "CharityDistribution_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
