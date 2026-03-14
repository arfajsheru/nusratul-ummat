/*
  Warnings:

  - A unique constraint covering the columns `[referenceNumber]` on the table `Donation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Donation" ADD COLUMN     "recordedBy" INTEGER,
ADD COLUMN     "referenceNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Donation_referenceNumber_key" ON "Donation"("referenceNumber");

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_recordedBy_fkey" FOREIGN KEY ("recordedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
