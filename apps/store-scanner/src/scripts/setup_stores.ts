import { CreateStoreDto, CreateStoreWithEventsDto, StoreService, getPrismaClient } from "scanner-store";

const stores: CreateStoreWithEventsDto[] = [

    {
        store: {
            version: 2,
            address: "A.4eb8a10cb9f87357.NFTStorefrontV2",
            storagePath: "NFTStorefrontV2",
            publicPath: "NFTStorefrontV2",
            startBlockHeight: 50305116,
        },
        events: ["ListingAvailable", "ListingCompleted"]
        
    }
]

async function setupStores() {
    const prisma = getPrismaClient();
    const storeService = new StoreService(prisma);
    if (process.env['NODE_ENV'] === "development" || process.env['NODE_ENV'] === "test") {
        for (const store of stores) {
            await storeService.createWithEvents(store);
        }
        console.log("Stores created");
    }
    prisma.$disconnect();
}


setupStores().then();