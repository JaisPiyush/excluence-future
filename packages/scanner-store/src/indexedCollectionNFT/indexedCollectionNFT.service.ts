import { PrismaClient } from "@prisma/client";
import { CreateIndexedCollectionNFT } from "./indexedCollectionNFT.dto";

export class IndexedCollectionNFTService {
    constructor(public readonly prisma: PrismaClient) {}



    async create(args: CreateIndexedCollectionNFT) {
        return await this.prisma.indexedCollectionNFT.create({
            data: {
                collectionId:args.collectionId,
                nftID: args.nftID,
                NFTTraitAndNFT: {
                    connectOrCreate: args.traits.map((trait) => {
                        const traitValue = typeof trait.value === 'string' ? trait.value: trait.value.toString();
                        return {
                            where: {
                                    collectionId_nftID_traitName_traitValue: {
                                    collectionId: args.collectionId,
                                    nftID: args.nftID,
                                    traitName: trait.name,
                                    traitValue: traitValue
                                }
                            },
                            create: {
                                trait: {
                                    connectOrCreate: {
                                        where: {
                                            name_value: {
                                                name: trait.name,
                                                value: traitValue
                                            }
                                        },
                                        create: {
                                            name: trait.name,
                                            value: traitValue
                                        }
                                    }
                                }
                            }
                        }
                    })
                },
                CollectionNFTOwners: {
                    create: {
                        owner: args.owner
                    }
                }
            }
        })
    }

    async findAllNFTInCollection(collectionId: string) {
        return await this.prisma.indexedCollectionNFT.findMany({
            where: {
                collectionId: collectionId
            }
        })
    }

    async getAllCollectionTraits(collectionId: string) {
        return await this.prisma.nFTTraitAndNFT.findMany({
            where: {
                collectionId
            }
        })
    }

    async getAllNFTTraits(collectionId: string, nftID: number) {
        return await this.prisma.nFTTraitAndNFT.findMany({
            where: {
                collectionId,
                nftID
            }
        })
    }

   
}