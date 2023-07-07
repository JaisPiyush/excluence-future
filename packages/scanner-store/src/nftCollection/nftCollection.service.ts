import { PrismaClient} from "@prisma/client";
import { CreateNFTCollectionDto } from "./nftCollection.dto";

export class NFTCollectionService {
    
    constructor(public readonly prisma: PrismaClient) {}

    // Create NFTCollection and connect it with StoreFront
    async createNFTCollection(args: CreateNFTCollectionDto) {
        return await this.prisma.nFTCollection.create({
            data: {
                address: args.address,
                storagePath: args.storagePath,
                publicPath: args.publicPath,
                NFTCollectionOnStoreFronts: {
                    create: [
                        {
                            storeFront: {
                                connect: {
                                    address: args.storeFrontAddress
                                }
                            }

                        }
                    ]
                }
            }
        });
    }

    // Get NFTCollection using address
    async getNFTCollectionByAddress(address: string) {
        return await this.prisma.nFTCollection.findFirst({
            where: {
                address: address
            }
        });
    }

    // Get NFTCollections using StoreFront address
    async getNFTCollectionsByStoreFront(storeFrontAddress: string) {
        return await this.prisma.nFTCollectionOnStoreFronts.findMany({
            where: {
                storFrontId: storeFrontAddress
            },
            include: {
                nftCollection: true,
                storeFront: false
            }
        })
    }

    // Get All StoreFronts using NFTCollection address
    async getStoreFrontsByNFTCollection(address: string) {
        return await this.prisma.nFTCollectionOnStoreFronts.findMany({
            where: {
                nftCollectionId: address
            },
            include: {
                storeFront: true,
                nftCollection: false
            }
        })
    }
}