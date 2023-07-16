-- CreateTable
CREATE TABLE "ListedCollectionMetadata" (
    "collectionId" TEXT NOT NULL,
    "publicPath" TEXT NOT NULL,
    "privatePath" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "contractName" TEXT NOT NULL,
    "collectionName" TEXT NOT NULL,
    "bannerImage" TEXT,
    "squareImage" TEXT NOT NULL,
    "description" TEXT,
    "externalURL" TEXT,
    "socials" JSONB NOT NULL,

    CONSTRAINT "ListedCollectionMetadata_pkey" PRIMARY KEY ("collectionId")
);

-- AddForeignKey
ALTER TABLE "ListedCollectionMetadata" ADD CONSTRAINT "ListedCollectionMetadata_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "ListedCollection"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
