import { MarketEventService, PrismaClient } from "scanner-store";
import { BaseApiModule } from "./base";
import { ResponseToolkit, Server, ServerApplicationState } from "@hapi/hapi";

export class MarketAPIModule extends BaseApiModule {
    private readonly marketEventService: MarketEventService;

    constructor(public readonly prisma: PrismaClient) {
        super(prisma);
        this.marketEventService = new MarketEventService(prisma);
    }

    registerHandle(server: Server<ServerApplicationState>): void {
        server.route({
            method: 'GET',
            path: '/market',
            handler: this.getTrendingCollectionData
        })
    }

    getTrendingCollectionData = async (req: Request, res: ResponseToolkit) => {
        const trendingCollection = (await this.marketEventService.getTrendingCollectionData()).map((collection) => {
            return {
                ...collection,
                avgprice: collection.avgprice ? Number(collection.avgprice) : 0,
                volume: collection.volume ? Number(collection.volume) : 0,
                listings: collection.listings ? Number(collection.listings) : 0,
                count: collection.count ? Number(collection.count) : 0
            }
        })
        
        return res.response({data: trendingCollection}).code(200)
    }
}