import { IndexableCollectionService, PrismaClient } from "scanner-store";
import { BaseApiModule } from "./base";
import { ResponseToolkit, Server, ServerApplicationState, Request } from "@hapi/hapi";

export class IndexedCollectionNFTAPIModule extends BaseApiModule {

    private readonly indexableCollectionService: IndexableCollectionService
    constructor(public readonly prisma: PrismaClient) { 
        super(prisma);
        this.indexableCollectionService = new IndexableCollectionService(prisma);
    }

    registerHandle(server: Server<ServerApplicationState>): void {
        server.route({
            method: 'POST',
            path: '/index/nft',
            handler: this.create
        });

        server.route({
            method: 'GET',
            path: '/index/nft',
            handler: this.findAll
        })
    }

    create = async (req: Request, res: ResponseToolkit) => {
        const payload  = req.payload as {address: string, startBlockHeight: number}
        const model = await this.indexableCollectionService.create(payload.address, payload.startBlockHeight);
        return res.response({data: {
            address: model.address,
            startBlockHeight: Number(model.startBlockHeight)
        }}).code(201)
    }

    findAll = async (req: Request, res: ResponseToolkit) => {
        const models = await this.indexableCollectionService.findAll();
        return res.response({
            data: models.map((model) => ({
                address: model.address,
                startBlockHeight: Number(model.startBlockHeight)
            }))
        }).code(200)
    }
}
