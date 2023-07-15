import { PrismaClient, StoreService } from "scanner-store";
import { BaseApiModule } from "./base";
import { Request, ResponseToolkit, Server, ServerApplicationState } from "@hapi/hapi";

export class StoreAPIModule extends BaseApiModule {

    private readonly storeService: StoreService;

    constructor(public readonly prisma: PrismaClient) {
        super(prisma);
        this.storeService = new StoreService(prisma);
    }

    registerHandle(server: Server<ServerApplicationState>): void {
        server.route({
            method: 'GET',
            path: '/store',
            handler: this.getAllStore
        });

        server.route({
            method: 'POST',
            path: '/store/height',
            handler: this.setHeightBlock
        })
    }

    getAllStore = async (req: Request, res: ResponseToolkit) => {
        const stores = await this.storeService.findAll();
        const trfStored = stores.map((store) => {
            return {
                ...store,
                startBlockHeight: Number(store.startBlockHeight)
            }
        })
        return res.response({data: trfStored}).code(200)
    }

    setHeightBlock = async (req: Request, res: ResponseToolkit) => {
        const payload = req.payload as any
        const address = payload.address;
        const height = (req.payload as any)['height'];
        await this.storeService.updateStoreStartHeightBlock(
            address,
            height
        )
        return res.response({data: 'done'}).code(201)
    }
}