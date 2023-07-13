/*
  Warnings:

  - The primary key for the `MarketEvent` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "MarketEvent" DROP CONSTRAINT "MarketEvent_pkey",
ALTER COLUMN "nftUUID" SET DATA TYPE BIGINT,
ALTER COLUMN "nftID" SET DATA TYPE BIGINT,
ALTER COLUMN "expiry" SET DATA TYPE BIGINT,
ALTER COLUMN "listingResourceId" SET DATA TYPE BIGINT,
ALTER COLUMN "timestamp" SET DATA TYPE BIGINT,
ALTER COLUMN "blockHeight" SET DATA TYPE BIGINT,
ADD CONSTRAINT "MarketEvent_pkey" PRIMARY KEY ("eventType", "listingResourceId", "collectionId", "storeId");

-- AlterTable
ALTER TABLE "Store" ALTER COLUMN "startBlockHeight" SET DATA TYPE BIGINT;
