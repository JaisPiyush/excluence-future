-- CreateEnum
CREATE TYPE "MarketEventType" AS ENUM ('Listing', 'Sale', 'Delisted');

-- CreateTable
CREATE TABLE "Store" (
    "version" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "publicPath" TEXT NOT NULL,
    "startBlockHeight" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "StoreEvents" (
    "address" TEXT NOT NULL,
    "event" TEXT NOT NULL,

    CONSTRAINT "StoreEvents_pkey" PRIMARY KEY ("address","event")
);

-- CreateTable
CREATE TABLE "ListedCollection" (
    "address" TEXT NOT NULL,

    CONSTRAINT "ListedCollection_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "MarketEvent" (
    "eventType" "MarketEventType" NOT NULL DEFAULT 'Listing',
    "collectionId" TEXT NOT NULL,
    "nftType" TEXT NOT NULL,
    "nftUUID" BIGINT NOT NULL,
    "nftID" BIGINT NOT NULL,
    "salePrice" TEXT NOT NULL DEFAULT '0',
    "salePaymentVaultType" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "expiry" BIGINT,
    "purchased" BOOLEAN NOT NULL DEFAULT false,
    "isListingActiveForSale" BOOLEAN NOT NULL,
    "storeFrontAddress" TEXT,
    "nftBuyer" TEXT,
    "nftSeller" TEXT,
    "listingResourceId" BIGINT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "txnId" TEXT NOT NULL,
    "blockHeight" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "MarketEvent_pkey" PRIMARY KEY ("eventType","listingResourceId","collectionId","storeId")
);

-- CreateTable
CREATE TABLE "StoreScannerConfig" (
    "scannerId" TEXT NOT NULL,
    "blockHeight" TEXT NOT NULL,

    CONSTRAINT "StoreScannerConfig_pkey" PRIMARY KEY ("scannerId")
);

-- AddForeignKey
ALTER TABLE "StoreEvents" ADD CONSTRAINT "StoreEvents_address_fkey" FOREIGN KEY ("address") REFERENCES "Store"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketEvent" ADD CONSTRAINT "MarketEvent_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "ListedCollection"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketEvent" ADD CONSTRAINT "MarketEvent_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
