-- CreateTable
CREATE TABLE "IndexableCollection" (
    "address" TEXT NOT NULL,
    "startBlockHeight" BIGINT NOT NULL,

    CONSTRAINT "IndexableCollection_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "IndexedCollectionNFT" (
    "collectionId" TEXT NOT NULL,
    "nftID" BIGINT NOT NULL,

    CONSTRAINT "IndexedCollectionNFT_pkey" PRIMARY KEY ("collectionId","nftID")
);

-- CreateTable
CREATE TABLE "CollectionNFTOwners" (
    "id" SERIAL NOT NULL,
    "collectionId" TEXT NOT NULL,
    "nftID" BIGINT NOT NULL,
    "owner" TEXT NOT NULL,

    CONSTRAINT "CollectionNFTOwners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NFTTrait" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "NFTTrait_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NFTTraitAndNFT" (
    "collectionId" TEXT NOT NULL,
    "nftID" BIGINT NOT NULL,
    "traitId" INTEGER NOT NULL,

    CONSTRAINT "NFTTraitAndNFT_pkey" PRIMARY KEY ("collectionId","nftID","traitId")
);

-- AddForeignKey
ALTER TABLE "CollectionNFTOwners" ADD CONSTRAINT "CollectionNFTOwners_collectionId_nftID_fkey" FOREIGN KEY ("collectionId", "nftID") REFERENCES "IndexedCollectionNFT"("collectionId", "nftID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFTTraitAndNFT" ADD CONSTRAINT "NFTTraitAndNFT_collectionId_nftID_fkey" FOREIGN KEY ("collectionId", "nftID") REFERENCES "IndexedCollectionNFT"("collectionId", "nftID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFTTraitAndNFT" ADD CONSTRAINT "NFTTraitAndNFT_traitId_fkey" FOREIGN KEY ("traitId") REFERENCES "NFTTrait"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
