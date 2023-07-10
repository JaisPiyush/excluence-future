-- CreateEnum
CREATE TYPE "FlowEventTypes" AS ENUM ('ListingAvailable', 'Purchased', 'ListingRemoved', 'NFTWithdrawn', 'NFTDeposit');

-- CreateTable
CREATE TABLE "NFTCollection" (
    "address" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "publicPath" TEXT NOT NULL,

    CONSTRAINT "NFTCollection_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "Store" (
    "version" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "publicPath" TEXT NOT NULL,
    "startBlockHeight" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "NFTCollectionOnStoreFronts" (
    "storId" TEXT NOT NULL,
    "nftCollectionId" TEXT NOT NULL,

    CONSTRAINT "NFTCollectionOnStoreFronts_pkey" PRIMARY KEY ("storId","nftCollectionId")
);

-- CreateTable
CREATE TABLE "FlowEvent" (
    "collection" TEXT NOT NULL,
    "eventName" "FlowEventTypes" NOT NULL DEFAULT 'ListingAvailable',
    "timestamp" INTEGER NOT NULL,
    "blockHeight" INTEGER NOT NULL,
    "transactionId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "FlowEvent_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "FlowEventsOnStore" (
    "flowEventId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,

    CONSTRAINT "FlowEventsOnStore_pkey" PRIMARY KEY ("flowEventId","storeId")
);

-- AddForeignKey
ALTER TABLE "NFTCollectionOnStoreFronts" ADD CONSTRAINT "NFTCollectionOnStoreFronts_storId_fkey" FOREIGN KEY ("storId") REFERENCES "Store"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFTCollectionOnStoreFronts" ADD CONSTRAINT "NFTCollectionOnStoreFronts_nftCollectionId_fkey" FOREIGN KEY ("nftCollectionId") REFERENCES "NFTCollection"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowEventsOnStore" ADD CONSTRAINT "FlowEventsOnStore_flowEventId_fkey" FOREIGN KEY ("flowEventId") REFERENCES "FlowEvent"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowEventsOnStore" ADD CONSTRAINT "FlowEventsOnStore_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
