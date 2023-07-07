import { PrismaClient } from "@prisma/client";
import { CreateStoreFrontDto } from "./storeFront.dto";

export class StoreFrontService {
    constructor(public readonly prisma: PrismaClient) {}

    async createStoreFront(args: CreateStoreFrontDto) {
        return await this.prisma.storeFront.create({
            data: {
                version: args.version,
                address: args.address,
                storagePath: args.storagePath,
                publicPath: args.publicPath
            }
        })
    }
}