import { PrismaClient, MarketEventType, Prisma } from "@prisma/client";
import { CheckListingExistsArgs, CreateDeListedEventDto, CreateListingDto, CreateSaleEventDto,RemoveListingFromSale } from "./marketEvent.dto";

export class MarketEventService {
    constructor(public readonly prisma: PrismaClient) {}

    async createListingEvent(args: CreateListingDto) {
        return await this.prisma.marketEvent.create({
            data: {
                eventType: MarketEventType.Listing,
                isListingActiveForSale: true,
                ...args
            }
        });
    }

    // Returns true if the listing associated with nft exists
    async doesListingExists(args: CheckListingExistsArgs) {
        args.isListingActiveForSale = args.isListingActiveForSale || false;
        return (await this.prisma.marketEvent.findFirst({
            where: {
                eventType: MarketEventType.Listing,
                ...args
            }
        })) !== null;
    }

    async findEvents(args: Prisma.MarketEventFindManyArgs) {
        return await this.prisma.marketEvent.findMany(args);
    }

    async removeListingFromSale(args: RemoveListingFromSale) {
        return await this.prisma.marketEvent.update({
            where: {
                eventType_listingResourceId_collectionId_storeId: {
                    eventType: MarketEventType.Listing,
                    listingResourceId: args.listingResourceId,
                    collectionId: args.collectionId,
                    storeId: args.storeId
                }
            },
            data: {
                isListingActiveForSale: false
            }
        });
    }

    async createSaleEvent(args: CreateSaleEventDto) {
        return await this.prisma.marketEvent.create({
            data: {
                eventType: MarketEventType.Sale,
                isListingActiveForSale: false,
                purchased: true,
                ...args
            }
        });
    }

    async createDeListedEvent(args: CreateDeListedEventDto) {
        return await this.prisma.marketEvent.create({
            data: {
                eventType: MarketEventType.Delisted,
                isListingActiveForSale: false,
                purchased: false,
                ...args
            }
        });
    }

    // async getTrendingCollections() {
    //     return await this.prisma.marketEvent.aggregate({
    //         _count: {
    //             purchased: true,
    //         }
    //     })
    // }


}