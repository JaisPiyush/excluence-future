import { PrismaClient } from "@prisma/client";

export class IndexableCollectionService {
    constructor(public readonly prisma: PrismaClient) {}

    async create(address: string, startBlockHeight: number) {
        return await this.prisma.indexableCollection.create({
            data: {
                address,
                startBlockHeight  
            }
        })
    }

    async findAll() {
        return await this.prisma.indexableCollection.findMany()
    }

    async getAllNFTTraitsStats(collectionId: string) {
        return await this.prisma.nFTTraitAndNFT.groupBy({
            by:['traitName', 'traitValue'],
            where: {
                collectionId
            },
            _count: {
                _all: true
            },
        })
    }

    async getTotalOwnersCountOfCollection(collectionId: string) {
        return await this.prisma.collectionNFTOwners.groupBy({
            by: ['nftID'],
            where: {
                collectionId
            },
            _count: {
                _all: true
            }
        })
    }
}