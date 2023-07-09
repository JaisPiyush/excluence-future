import { PrismaClient } from "@prisma/client";
import { CreateListingAvailableDto } from "./listingAvailable.dto";

export class ListingAvailableService {
    constructor(public readonly prisma: PrismaClient) {}

    async createListingAvailable(args: CreateListingAvailableDto) {
        return await this.prisma.listingAvailable.create({
            data: {
                collection: args.collection,
                nftId: args.nftId,
                storeFrontAddress: args.storedFrontAddress,
                listingResourceId: args.listingResourceId,
                nftUUID: args.nftUUID,
                salePrice: args.salePrice,
                expiry: args.expiry,
                salePaymentVaultType: args.salePaymentVaultType,
                blockHeight: args.blockHeight,
                transactionId: args.transactionId,
                commissionAmount: args.commissionAmount,
                timestamp: args.timestamp,

                ListingAvailableOnStoreFronts: {
                    create: [
                        {
                            storeFront: {
                                connect: {
                                    address: args.storedFrontAddress
                                }
                            }
                        }
                    ]
                }
            }
        });
    }


    // Get listing using listingResourceId
    async getListingByLRId(lRId: number) {
        return await this.prisma.listingAvailable.findFirst({
            where: {
                listingResourceId: lRId
            }
        });
    }

    // Fetch all listings from collection
    async getListingsFromCollection(collection: string) {
        return await this.prisma.listingAvailable.findMany({
            where: {
                collection
            }
        })
    }

    // Get all store fronts of a listing
    async getStoreFrontsOfListing(lrId: number) {
        return await this.prisma.storeFront.findMany({
            include: {
                ListingAvailableOnStoreFronts: {
                    where: {
                        listingAvailableId: lrId
                    },
                    select: {
                        storeFront: true
                    }
                }
            }
        })
    }

    // Fetch all StoreFronts connected to a listing
    async getStoreFrontsOfBatchListings(lrIds: number[]) {
        return await this.prisma.storeFront.findMany({
            include: {
                ListingAvailableOnStoreFronts: {
                    where: {
                        listingAvailableId: {
                            in: lrIds
                        }
                    },
                    select: {
                        storeFront: true,
                        listingAvailableId: true
                    }
                }
            }
        })
    }
}