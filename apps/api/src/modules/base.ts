import {Server} from "@hapi/hapi";
import {PrismaClient} from "scanner-store";

export class BaseApiModule {

    constructor(public readonly prisma: PrismaClient) {}

    registerHandle(server: Server) {
        throw new Error("Method not implemented")
    }
}