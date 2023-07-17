import { Job } from "bullmq";
import { JobImp, BaseJob } from "./job.definition";
import { FlowCapturedEvent, FlowNamedType } from "./types";
import { CreateListingDto, ListedCollectionMetadataService, ListedCollectionService, MarketEventService, Prisma, PrismaClient, getCreateLCMDtoFromCollectionViewData } from "scanner-store";
import { getContractId } from "./utils";
import { Logger } from "logger";
import { getUTCTime, stringToBigInt } from "../utils";
import { bannedCollections } from "./banned-collections";
import {getCollectionView} from "flow-dock/src/script/get_collection_view"

export interface AddListingData {
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

    handle = async (job?: Job<FlowCapturedEvent>, prisma?: PrismaClient) => {
        if(!prisma) throw new Error("Prisma client muse be defined.");
        try {
            const data = this.preDataTransform(this.payload as any as FlowCapturedEvent) as FlowCapturedEvent<AddListingData>;
            
            
            const listedCollectionService = new ListedCollectionService(prisma);
            const marketEventService = new MarketEventService(prisma);
            
            const nftType = data.data.nftType.typeID as string;
            const collectionId = getContractId(nftType);

            const listedCollectionMetadataService = new ListedCollectionMetadataService(prisma);
            const collectionViewData = await getCollectionView(collectionId);

            Logger.info(`Working on collection ${collectionId}, ${collectionViewData}`)

            if (collectionViewData === null) {
                // If NFT collection is not present in  NFT Catalog do not register
                return
            } else if (! await listedCollectionMetadataService.doesLCMDExists(collectionId)) {
                await listedCollectionMetadataService.createLCMD(getCreateLCMDtoFromCollectionViewData(collectionViewData))
            }

            if (bannedCollections.includes(collectionId)) {
                return;
            }

            
           
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
                salePrice: stringToBigInt(data.data.salePrice),
                salePaymentVaultType: data.data.salePaymentVaultType.typeID,
                storeId: getContractId(data.type),
                expiry: data.data.expiry,
                timestamp: getUTCTime(data.blockTimestamp),
                listingResourceId: data.data.listingResourceID,
                blockHeight: data.blockHeight,
                txnId: data.transactionId,
                storeFrontAddress: data.data.storefrontAddress
            }

            Logger.info(`Creating listing ${JSON.stringify(createListingArgs)}`);

            await marketEventService.createListingEvent(createListingArgs);

            Logger.info(`Created listing ${createListingArgs.listingResourceId}`);

        }catch(e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
                // P2022: Unique constraint failed
                Logger.info(`Listing already exists.`)
            }else{
                Logger.error(`${this.name}: ${e}`);
            }
        }
    }

}