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
        const trendingCollection = await this.marketEventService.getTrendingCollectionData();
        return res.response({data: trendingCollection}).code(200)
    }
}