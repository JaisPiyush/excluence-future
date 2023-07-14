import { PrismaClient } from "@prisma/client";
import { CreateStoreEventsDto } from "./storeEvents.dto";

export class StoreEventsService {
    constructor(public readonly prisma: PrismaClient) {}

    async create(args: CreateStoreEventsDto) {
        return await this.prisma.storeEvents.create({
            data: args
        });
    }

    async findAll() {
        return await this.prisma.storeEvents.findMany();
    }

    async findStoreEvents(address: string) {
        return await this.prisma.storeEvents.findMany({
            where: {
                address: address
            }
        });
    }

    async createMany(args: CreateStoreEventsDto[]) {
        return await this.prisma.storeEvents.createMany({
            data: args
        });
    }
}