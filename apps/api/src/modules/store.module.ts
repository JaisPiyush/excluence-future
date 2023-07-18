import { CreateStoreWithEventsDto, PrismaClient, StoreService } from "scanner-store";
import { BaseApiModule } from "./base";
import { Request, ResponseToolkit, Server, ServerApplicationState } from "@hapi/hapi";
import { CreateStoreEventsDto } from "scanner-store/src/storeEvents/storeEvents.dto";

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

        server.route({
            method: 'POST',
            path: '/store',
            handler: this.createWithEvents
        })
        server.route({
            method: 'POST',
            path: '/store/isActive',
            handler: this.setIsActive
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

    createWithEvents = async (req: Request, res: ResponseToolkit) => {
        const payload  = req.payload as CreateStoreWithEventsDto;
        const store = await this.storeService.createWithEvents(payload);
        return res.response({data: store}).code(201)

    }

    setIsActive = async (req: Request, res: ResponseToolkit) => {
        const payload = (req.payload as any) as {address: string, isActive: boolean}
        await this.storeService.updateIsActiveOfStore(payload.address, payload.isActive)
        return res.response({data: 'done'}).code(201)
    }
}