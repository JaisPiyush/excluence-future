/*
  Warnings:

  - The `salePrice` column on the `MarketEvent` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "MarketEvent" DROP COLUMN "salePrice",
ADD COLUMN     "salePrice" BIGINT NOT NULL DEFAULT 0;
