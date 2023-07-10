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
                            store: {
                                connect: {
                                    address: args.storeAddress
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
    async getNFTCollectionsByStore(storeFrontAddress: string) {
        return await this.prisma.nFTCollectionOnStoreFronts.findMany({
            where: {
                storId: storeFrontAddress
            },
            include: {
                nftCollection: true,
                store: false
            }
        })
    }

    // Get All StoreFronts using NFTCollection address
    async getStoresByNFTCollection(address: string) {
        return await this.prisma.nFTCollectionOnStoreFronts.findMany({
            where: {
                nftCollectionId: address
            },
            include: {
                store: true,
                nftCollection: false
            }
        })
    }
}