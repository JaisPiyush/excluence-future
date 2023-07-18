import { PrismaClient, MarketEventType, Prisma } from "@prisma/client";
import { CheckListingExistsArgs, CreateDeListedEventDto, CreateListingDto, CreateSaleEventDto,RemoveListingFromSale, TrendingCollectionDto } from "./marketEvent.dto";

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

    async getTrendingCollectionData(): Promise<TrendingCollectionDto[]> {
       try {
            return await this.prisma.$queryRaw`SELECT "squareImage", "collectionName", n.*,
                lag(n.volume,1, 0) OVER (PARTITION BY n."collectionId" ORDER BY n.date_trunc) as volume_chg,
                lag(n.count,1, 0) OVER (PARTITION BY n."collectionId" ORDER BY n.date_trunc) as sales_chg
                FROM "ListedCollectionMetadata"
                LEFT JOIN
                (
                SELECT "MarketEvent"."collectionId", 
                AVG(CASE WHEN "eventType" = 'Sale' THEN "salePrice" ELSE NULL END)/POWER(10,8) AS avgPrice, 
                SUM(CASE WHEN "eventType" = 'Sale' THEN "salePrice" ELSE NULL END)/POWER(10,8) AS volume, 
                COUNT(CASE WHEN "eventType" = 'Listing' THEN 1 ELSE NULL END ) as listings, 
                COUNT(CASE WHEN "eventType" = 'Sale' THEN 1 ELSE NULL END), 
                DATE_TRUNC('day', timestamp) as date_trunc
                FROM "MarketEvent"
                GROUP BY "MarketEvent"."collectionId", date_trunc
                ) n
                ON "ListedCollectionMetadata"."collectionId" = n."collectionId"
                AND n.date_trunc >= current_date - interval '7' day
                ORDER BY n.date_trunc DESC, n.volume
                ;`;
            
       }catch(e) {
            console.log(e)
            return []
       }
    }



}