import { BaseApiModule } from "./base";
import {Request, ResponseToolkit, Server, ServerApplicationState} from "@hapi/hapi";
import {CreateStoreDto} from "scanner-store/src/storeFront/storeFront.dto";
import Joi from 'joi'
import { PrismaClient, StoreFrontService } from "scanner-store";

const createStoreFrontSchema = Joi.object({
    version: Joi.number().greater(0).less(3).required(),
    address: Joi.string().required(),
    storagePath: Joi.string().required(),
    publicPath: Joi.string().required(),
    startBlockHeight: Joi.number().required().min(0)
})

export class StoreFrontModule extends BaseApiModule {

    private readonly storeFrontService: StoreFrontService;

    constructor(public readonly prisma: PrismaClient) {
        super(prisma);
        this.storeFrontService = new StoreFrontService(prisma);
        // console.log(`Registerd service ${this.storeFrontService}`)
    }

    registerHandle(server: Server<ServerApplicationState>): void {
        server.route({
            method: 'POST',
            path: '/store',
            handler: this.create,
            options: {
                validate: {
                    payload: createStoreFrontSchema
                }
            }
        });

        server.route({
            method: 'DELETE',
            path: '/store/{address}',
            handler: this.delete,
        })

        server.route({
            method: 'GET',
            path: '/store',
            handler: this.get
        })
    }

    create = async(req: Request, res: ResponseToolkit) => {
        const body = req.payload as CreateStoreDto;
        const store = await this.storeFrontService.createStoreFront(body);
        return res.response({"data": store}).code(201)
    }

    delete = async(req: Request, res: ResponseToolkit) => {
        const address = req.params['address'] as string;
        await this.storeFrontService.delete(address);
        return res.response({"data": true}).code(201)
    }

    get = async(req: Request, res: ResponseToolkit) => {
        return res.response({
            "data": await this.storeFrontService.getAll()
        }).code(200)
    }
}