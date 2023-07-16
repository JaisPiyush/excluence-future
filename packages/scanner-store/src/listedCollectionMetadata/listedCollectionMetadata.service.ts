import { PrismaClient } from "@prisma/client";
import { CreateListedCollectionMetadataDto } from "./listedCollectionMetadata.dto";

export class ListedCollectionMetadataService {
    constructor(public readonly prisma: PrismaClient) {}

    async createLCMD(args: CreateListedCollectionMetadataDto) {
        return await this.prisma.listedCollectionMetadata.create({
            data: args
        });
    }

    async doesLCMDExists(collectionId: string) {
        return (await this.prisma.listedCollectionMetadata.findFirst({
            where: {
                collectionId
            }
        })) != null
    }
}