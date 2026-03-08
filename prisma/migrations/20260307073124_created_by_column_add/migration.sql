/*
  Warnings:

  - Made the column `vendorId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_vendorId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdBy" INTEGER,
ALTER COLUMN "vendorId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
