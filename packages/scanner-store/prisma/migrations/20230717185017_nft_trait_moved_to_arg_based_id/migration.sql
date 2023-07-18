/*
  Warnings:

  - The primary key for the `NFTTrait` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `NFTTrait` table. All the data in the column will be lost.
  - The primary key for the `NFTTraitAndNFT` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `traitId` on the `NFTTraitAndNFT` table. All the data in the column will be lost.
  - Added the required column `traitName` to the `NFTTraitAndNFT` table without a default value. This is not possible if the table is not empty.
  - Added the required column `traitValue` to the `NFTTraitAndNFT` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "NFTTraitAndNFT" DROP CONSTRAINT "NFTTraitAndNFT_traitId_fkey";

-- AlterTable
ALTER TABLE "NFTTrait" DROP CONSTRAINT "NFTTrait_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "NFTTrait_pkey" PRIMARY KEY ("name", "value");

-- AlterTable
ALTER TABLE "NFTTraitAndNFT" DROP CONSTRAINT "NFTTraitAndNFT_pkey",
DROP COLUMN "traitId",
ADD COLUMN     "traitName" TEXT NOT NULL,
ADD COLUMN     "traitValue" TEXT NOT NULL,
ADD CONSTRAINT "NFTTraitAndNFT_pkey" PRIMARY KEY ("collectionId", "nftID", "traitName", "traitValue");

-- AddForeignKey
ALTER TABLE "NFTTraitAndNFT" ADD CONSTRAINT "NFTTraitAndNFT_traitName_traitValue_fkey" FOREIGN KEY ("traitName", "traitValue") REFERENCES "NFTTrait"("name", "value") ON DELETE RESTRICT ON UPDATE CASCADE;
