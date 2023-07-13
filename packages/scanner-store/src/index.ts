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

export function getPrismaClient() {
    return new PrismaClient();
}