import { PrismaClient } from "@prisma/client";
import { CreateStoreDto } from "./store.dto";

export class StoreService {
    constructor(public readonly prisma: PrismaClient) {}

    async create(args: CreateStoreDto) {
        return await this.prisma.store.create({
            data: args
        });
    }

    async findAll() {
        return await this.prisma.store.findMany();
    }

    async findStoreByAddress(address: string) {
        return await this.prisma.store.findFirst({
            where: {
                address
            }
        })
    }
}