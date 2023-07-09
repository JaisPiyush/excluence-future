import { SettingsServiceInterface } from '@rayvin-flow/flow-scanner-lib/lib/settings/settings-service';
import {getPrismaClient, StoreScannerConfigService, PrismaClient} from "scanner-store"
export class PrismaDBSettingService implements SettingsServiceInterface {
    
    private storeScannerConfigService: StoreScannerConfigService | undefined = undefined;

    constructor(public readonly scannerId: string, prisma: PrismaClient = getPrismaClient()) {
        this.storeScannerConfigService = new StoreScannerConfigService(prisma);
    }

    async getProcessedBlockHeight(): Promise<number | undefined> {
        return await this.storeScannerConfigService?.getProcessedBlockHeight(this.scannerId);
    }

    async setProcessedBlockHeight(blockHeight: number): Promise<void> {
       await this.storeScannerConfigService?.setProcessedBlockHeight(this.scannerId, blockHeight.toString()); 
    }

    async destroy() {
        await this.storeScannerConfigService?.destroy(this.scannerId);
    }
}