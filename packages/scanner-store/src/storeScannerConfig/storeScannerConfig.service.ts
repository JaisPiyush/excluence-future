import { PrismaClient } from "@prisma/client";

export class StoreScannerConfigService {
    constructor(public readonly prisma: PrismaClient) {}

    // set process block height
    async setProcessedBlockHeight(scannerId: string, blockHeight: string) {
        await this.prisma.storeScannerConfig.upsert({
            where: {
                scannerId: scannerId
            },
            update: {
                blockHeight
            },
            create: {
                scannerId,
                blockHeight
            }
        })
    }

    async getProcessedBlockHeight(scannerId: string) {
        const scannerConfig = await this.prisma.storeScannerConfig.findFirst({
            where: {
                scannerId
            }
        });

        return scannerConfig? parseInt(scannerConfig.blockHeight) : undefined;
    }

    async destroy(scannerId: string) {
        await this.prisma.storeScannerConfig.delete({
            where: {
                scannerId
            }
        })
    }
}