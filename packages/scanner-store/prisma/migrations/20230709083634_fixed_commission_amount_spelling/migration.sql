/*
  Warnings:

  - You are about to drop the column `commisionAmount` on the `ListingAvailable` table. All the data in the column will be lost.
  - Added the required column `commissionAmount` to the `ListingAvailable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ListingAvailable" DROP COLUMN "commisionAmount",
ADD COLUMN     "commissionAmount" DOUBLE PRECISION NOT NULL;
