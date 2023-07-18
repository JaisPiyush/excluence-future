import { ListedCollectionService, PrismaClient } from "scanner-store";
import { BaseApiModule } from "./base";
import { Request, ResponseToolkit, Server, ServerApplicationState } from "@hapi/hapi";

export class ListedCollectionAPIModule extends BaseApiModule {

    private readonly listedCollectionService: ListedCollectionService;
    

    constructor(public readonly prisma: PrismaClient) {
        super(prisma);
        this.listedCollectionService = new ListedCollectionService(prisma);
    }

    registerHandle(server: Server<ServerApplicationState>): void {
        server.route({
            path: '/collection',
            method: 'GET',
            handler: this.getTrendingMarket
        })
    }

    getTrendingMarket = async (req: Request, res: ResponseToolkit) => {
        const collections =  await this.listedCollectionService.getTrendingCollectionsWithSaleData();
        return res.response({data: collections}).code(200)
    }
}