import { PrismaClient } from "@prisma/client";

export {PrismaClient}

export * from "./storeScannerConfig/storeScannerConfig.service";
export * from "./storeFront/storeFront.service";

export function getPrismaClient() {
    return new PrismaClient();
}