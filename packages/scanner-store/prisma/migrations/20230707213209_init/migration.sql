-- CreateTable
CREATE TABLE "NFTCollection" (
    "address" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "publicPath" TEXT NOT NULL,

    CONSTRAINT "NFTCollection_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "StoreFront" (
    "version" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "publicPath" TEXT NOT NULL,

    CONSTRAINT "StoreFront_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "NFTCollectionOnStoreFronts" (
    "storFrontId" TEXT NOT NULL,
    "nftCollectionId" TEXT NOT NULL,

    CONSTRAINT "NFTCollectionOnStoreFronts_pkey" PRIMARY KEY ("storFrontId","nftCollectionId")
);

-- CreateTable
CREATE TABLE "ListingAvailable" (
    "collection" TEXT NOT NULL,
    "nftId" INTEGER NOT NULL,
    "storeFrontAddress" TEXT NOT NULL,
    "listingResourceId" INTEGER NOT NULL,
    "nftUUID" INTEGER NOT NULL,
    "salePrice" DOUBLE PRECISION NOT NULL,
    "expiry" INTEGER NOT NULL,
    "salePayementVaultType" TEXT NOT NULL,
    "blockHeight" INTEGER NOT NULL,
    "transactionId" TEXT NOT NULL,
    "commisionAmount" DOUBLE PRECISION NOT NULL,
    "timestamp" INTEGER NOT NULL,

    CONSTRAINT "ListingAvailable_pkey" PRIMARY KEY ("listingResourceId")
);

-- CreateTable
CREATE TABLE "ListingAvailableOnStoreFronts" (
    "listingAvailableId" INTEGER NOT NULL,
    "storeFrontId" TEXT NOT NULL,

    CONSTRAINT "ListingAvailableOnStoreFronts_pkey" PRIMARY KEY ("listingAvailableId","storeFrontId")
);

-- CreateTable
CREATE TABLE "ListingCompleted" (
    "collection" TEXT NOT NULL,
    "nftId" INTEGER NOT NULL,
    "storeFrontAddress" TEXT NOT NULL,
    "purchased" BOOLEAN NOT NULL,
    "listingResourceId" INTEGER NOT NULL,
    "nftUUID" INTEGER NOT NULL,
    "salePrice" DOUBLE PRECISION NOT NULL,
    "expiry" INTEGER NOT NULL,
    "salePayementVaultType" TEXT NOT NULL,
    "blockHeight" INTEGER NOT NULL,
    "transactionId" TEXT NOT NULL,
    "commisionAmount" DOUBLE PRECISION NOT NULL,
    "timestamp" INTEGER NOT NULL,

    CONSTRAINT "ListingCompleted_pkey" PRIMARY KEY ("listingResourceId")
);

-- CreateTable
CREATE TABLE "ListingCompletedOnStoreFront" (
    "listingCompletedId" INTEGER NOT NULL,
    "storeFrontId" TEXT NOT NULL,

    CONSTRAINT "ListingCompletedOnStoreFront_pkey" PRIMARY KEY ("listingCompletedId","storeFrontId")
);

-- CreateTable
CREATE TABLE "NFTWithdraw" (
    "collection" TEXT NOT NULL,
    "nftId" INTEGER NOT NULL,
    "benf" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "blockHeight" INTEGER NOT NULL,
    "transactionId" TEXT NOT NULL,

    CONSTRAINT "NFTWithdraw_pkey" PRIMARY KEY ("collection","nftId","benf","transactionId")
);

-- CreateTable
CREATE TABLE "NFTDeposit" (
    "collection" TEXT NOT NULL,
    "nftId" INTEGER NOT NULL,
    "benf" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "blockHeight" INTEGER NOT NULL,
    "transactionId" TEXT NOT NULL,

    CONSTRAINT "NFTDeposit_pkey" PRIMARY KEY ("collection","nftId","benf","transactionId")
);

-- CreateTable
CREATE TABLE "StoreScannerConfig" (
    "scannerId" TEXT NOT NULL,
    "blockHeight" TEXT NOT NULL,

    CONSTRAINT "StoreScannerConfig_pkey" PRIMARY KEY ("scannerId")
);

-- AddForeignKey
ALTER TABLE "NFTCollectionOnStoreFronts" ADD CONSTRAINT "NFTCollectionOnStoreFronts_storFrontId_fkey" FOREIGN KEY ("storFrontId") REFERENCES "StoreFront"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFTCollectionOnStoreFronts" ADD CONSTRAINT "NFTCollectionOnStoreFronts_nftCollectionId_fkey" FOREIGN KEY ("nftCollectionId") REFERENCES "NFTCollection"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingAvailableOnStoreFronts" ADD CONSTRAINT "ListingAvailableOnStoreFronts_listingAvailableId_fkey" FOREIGN KEY ("listingAvailableId") REFERENCES "ListingAvailable"("listingResourceId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingAvailableOnStoreFronts" ADD CONSTRAINT "ListingAvailableOnStoreFronts_storeFrontId_fkey" FOREIGN KEY ("storeFrontId") REFERENCES "StoreFront"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingCompletedOnStoreFront" ADD CONSTRAINT "ListingCompletedOnStoreFront_listingCompletedId_fkey" FOREIGN KEY ("listingCompletedId") REFERENCES "ListingCompleted"("listingResourceId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingCompletedOnStoreFront" ADD CONSTRAINT "ListingCompletedOnStoreFront_storeFrontId_fkey" FOREIGN KEY ("storeFrontId") REFERENCES "StoreFront"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
