/*
  Warnings:

  - You are about to drop the column `salePayementVaultType` on the `ListingAvailable` table. All the data in the column will be lost.
  - Added the required column `salePaymentVaultType` to the `ListingAvailable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ListingAvailable" DROP COLUMN "salePayementVaultType",
ADD COLUMN     "salePaymentVaultType" TEXT NOT NULL;
