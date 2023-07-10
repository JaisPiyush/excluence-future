import { PrismaClient } from "@prisma/client";
import { CreateStoreDto } from "./store.dto";

export class StoreFrontService {
    constructor(public readonly prisma: PrismaClient) {}

    async createStoreFront(args: CreateStoreDto) {
        return await this.prisma.store.create({
            data: {
                ...args
            }
        })
    }

    async delete(address: string) {
        await this.prisma.store.delete({
            where: {
                address
            }
        })
    }

    async getAll() {
        return await this.prisma.store.findMany();
    }
}