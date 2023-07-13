import { PrismaClient } from "@prisma/client";

export class ListedCollectionService {
    constructor(public readonly prisma: PrismaClient) {}

    async createListedCollection(address: string) {
        return await this.prisma.listedCollection.create({
            data:{
                address
            }
        });
    }

    async findListedCollection(address: string) {
        return await this.prisma.listedCollection.findFirst({
            where: {
                address
            }
        });
    }
}