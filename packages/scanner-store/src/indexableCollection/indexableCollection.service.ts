import { PrismaClient } from "@prisma/client";

export class IndexableCollectionService {
    constructor(public readonly prisma: PrismaClient) {}

    async create(address: string, startBlockHeight: number) {
        return await this.prisma.indexableCollection.create({
            data: {
                address,
                startBlockHeight  
            }
        })
    }

    async findAll() {
        return await this.prisma.indexableCollection.findMany()
    }
}