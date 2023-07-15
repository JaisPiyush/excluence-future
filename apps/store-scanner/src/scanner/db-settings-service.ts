import { SettingsServiceInterface } from '@rayvin-flow/flow-scanner-lib/lib/settings/settings-service';
import {getPrismaClient, StoreScannerConfigService, PrismaClient} from "scanner-store"
export class PrismaDBSettingService implements SettingsServiceInterface {
    
    private storeScannerConfigService: StoreScannerConfigService | undefined = undefined;
    private readonly permanent: boolean;

    constructor(public readonly scannerId: string, prisma: PrismaClient = getPrismaClient(), permanent = false) {
        this.storeScannerConfigService = new StoreScannerConfigService(prisma);
        this.permanent = permanent;
    }

    async initProcessedHeight(blockHeight: number) {
        if ((await this.getProcessedBlockHeight()) === undefined) {
            await this.setProcessedBlockHeight(blockHeight);
        }
    }

    async getProcessedBlockHeight(): Promise<number | undefined> {
        return await this.storeScannerConfigService?.getProcessedBlockHeight(this.scannerId);
    }

    async setProcessedBlockHeight(blockHeight: number): Promise<void> {
       await this.storeScannerConfigService?.setProcessedBlockHeight(this.scannerId, blockHeight.toString()); 
    }

    async destroy() {
        if (this.permanent) return;
        await this.storeScannerConfigService?.destroy(this.scannerId);
    }
}