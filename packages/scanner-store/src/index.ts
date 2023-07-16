import { PrismaClient, Prisma } from "@prisma/client";

export {PrismaClient, Prisma}

export * from "./storeScannerConfig/storeScannerConfig.service";

// Store
export * from "./store/store.service";
export * from "./store/store.dto";

// MarketEvent
export * from "./marketEvent/marketEvent.service";
export * from "./marketEvent/marketEvent.dto";

// Listed Collection
export * from "./listedCollection/listedCollection.service";
// export * from "./listedCollection/listedCollection.dto";

//ListedCollectionMetadata
export * from "./listedCollectionMetadata/listedCollectionMetadata.service";
export * from "./listedCollectionMetadata/listedCollectionMetadata.dto"

export function getPrismaClient() {
    return new PrismaClient();
}