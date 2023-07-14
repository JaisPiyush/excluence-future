import { Job } from "bullmq";
import { JobImp, BaseJob } from "./job.definition";
import { FlowCapturedEvent, FlowNamedType } from "./types";
import { CreateListingDto, ListedCollectionService, MarketEventService, Prisma, PrismaClient } from "scanner-store";
import { getContractId } from "./utils";
import { Logger } from "logger";

interface AddListingData {
    storefrontAddress: string;
    listingResourceID: number;
    nftType: FlowNamedType,
    nftUUID: number;
    nftID: number;
    salePaymentVaultType: FlowNamedType;
    salePrice: string;
    expiry: number;
}

export class AddListingJob extends BaseJob implements JobImp {
     
    constructor(public payload: Record<string, unknown>) {
        super();
    }

    async createListedCollection(listedCollectionService: ListedCollectionService, collectionId: string) {
        return await listedCollectionService.createListedCollection(collectionId);
    }

    handle = async (job?: Job<FlowCapturedEvent<AddListingData>>, prisma?: PrismaClient) => {
        if(!prisma) throw new Error("Prisma client muse be defined.");
        try {
            const data = this.payload as any as FlowCapturedEvent<AddListingData>;
            const listedCollectionService = new ListedCollectionService(prisma);
            const marketEventService = new MarketEventService(prisma);
            const nftType = data.data.nftType.typeID as string;
            const collectionId = getContractId(nftType);
            let listedCollection = await listedCollectionService.findListedCollection(collectionId);
            
            if (listedCollection === null) {
                // Create collection if doesn't exists
                listedCollection = await this.createListedCollection(listedCollectionService, collectionId);
            }

            const doesListingExists = await marketEventService.doesListingExists({
                collectionId: collectionId,
                storeId: getContractId(data.type),
                listingResourceId: data.data.listingResourceID
            });
            if (doesListingExists) {
                Logger.info(`Duplicate event ${JSON.stringify({collectionId, storeId: getContractId(data.type), listingResourceId: data.data.listingResourceID})}`)
                return;
            }

            const createListingArgs: CreateListingDto = {
                collectionId: collectionId,
                nftType: nftType,
                nftUUID: data.data.nftUUID,
                nftID: data.data.nftID,
                salePrice: data.data.salePrice,
                salePaymentVaultType: data.data.salePaymentVaultType.typeID,
                storeId: getContractId(data.type),
                expiry: data.data.expiry,
                timestamp: (new Date(data.blockTimestamp)).getTime(),
                listingResourceId: data.data.listingResourceID,
                blockHeight: data.blockHeight,
                txnId: data.transactionId,
                storeFrontAddress: data.data.storefrontAddress
            }

            Logger.info(`Creating listing ${JSON.stringify(createListingArgs)}`);

            await marketEventService.createListingEvent({
                collectionId: collectionId,
                nftType: nftType,
                nftUUID: data.data.nftUUID,
                nftID: data.data.nftID,
                salePrice: data.data.salePrice,
                salePaymentVaultType: data.data.salePaymentVaultType.typeID,
                storeId: getContractId(data.type),
                expiry: data.data.expiry,
                timestamp: (new Date(data.blockTimestamp)).getTime(),
                listingResourceId: data.data.listingResourceID,
                blockHeight: data.blockHeight,
                txnId: data.transactionId,
                storeFrontAddress: data.data.storefrontAddress
            });

            Logger.info(`Created listing ${createListingArgs.listingResourceId}`);

        }catch(e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
                // P2022: Unique constraint failed
                Logger.info(`Listing already exists.`)
            }else{
                Logger.error(`AddListingJobException: ${e}`);
            }
        }
    }

}