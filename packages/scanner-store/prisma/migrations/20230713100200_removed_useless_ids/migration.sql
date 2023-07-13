/*
  Warnings:

  - The primary key for the `MarketEvent` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "MarketEvent" DROP CONSTRAINT "MarketEvent_pkey",
ADD CONSTRAINT "MarketEvent_pkey" PRIMARY KEY ("eventType", "listingResourceId", "collectionId");
