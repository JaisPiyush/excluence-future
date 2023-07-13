import { CreateStoreDto, getPrismaClient } from "scanner-store";

const stores: CreateStoreDto[] = [

    {
        version: 2,
        address: "A.4eb8a10cb9f87357.NFTStorefrontV2",
        storagePath: "NFTStorefrontV2StoragePath",
        publicPath: "NFTStorefrontV2PublicPath",
        startBlockHeight: 56381377
    }
]

async function setupStores() {
    const prisma = getPrismaClient();
    if (process.env['NODE_ENV'] === "development" || process.env['NODE_ENV'] === "test") {
        await prisma.store.createMany({
            data: stores
        });
        console.log("Stores created");
    }
    prisma.$disconnect();
}


setupStores().then();