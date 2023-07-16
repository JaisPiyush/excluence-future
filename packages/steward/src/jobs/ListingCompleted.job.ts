import { Job } from "bullmq";
import { CreateDeListedEventDto, CreateSaleEventDto, ListedCollectionService, MarketEventService, Prisma, PrismaClient, RemoveListingFromSale } from "scanner-store";
import { BaseJob, JobImp } from "./job.definition";
import { FlowCapturedEvent, FlowNamedType } from "./types";
import * as fcl from "@onflow/fcl";
import { getContractId } from "./utils";
import { Logger } from "logger";
import { getUTCTime, stringToBigInt } from "../utils";
import { bannedCollections } from "./banned-collections";

interface ListingCompletedData {
    listingResourceID: number;
    storefrontResourceID: number;
    purchased: boolean;
    nftType: FlowNamedType;
    nftUUID: number;
    nftID: number;
    salePaymentVaultType: FlowNamedType;
    salePrice: string;
    expiry: number;

}

interface NFTWithdraw {
    id: number;
    from: string;
}

interface NFTDeposit {
    id: number;
    to: string;
}

interface FlowTransferEvent<T =  NFTDeposit | NFTWithdraw>{
    type: string;
    transactionId: string;
    transactionIndex: number;
    eventIndex: number;
    data: T;
}

export class ListingCompletedJob extends BaseJob implements JobImp {

    constructor(public payload: Record<string, unknown>) {
        super();
    }

    findWithdrawAndDepositEvent(collectionId: string, events: FlowTransferEvent[]) {
        const withdrawEventName = `${collectionId}.Withdraw`;
        const depositEventName = `${collectionId}.Deposit`

        const targetEvents: FlowTransferEvent[] = [];

        for(const event of events) {
            if (event.type === withdrawEventName) {
                targetEvents[0] = event;
            }else if(event.type === depositEventName) {
                targetEvents[1] = event;
            }
        }

        return targetEvents;
    }

    async createSaleEvent(
            collectionId: string,
            storeId: string,
            marketEventService: MarketEventService,
            data: FlowCapturedEvent<ListingCompletedData>, 
            transferEvents: FlowTransferEvent[]
        ) {

        const createSaleArgs: CreateSaleEventDto = {
            collectionId,
            storeId,
            nftType: data.data.nftType.typeID,
            nftUUID: data.data.nftUUID,
            nftID: data.data.nftID,
            salePrice: stringToBigInt(data.data.salePrice),
            salePaymentVaultType: data.data.salePaymentVaultType.typeID,
            timestamp: getUTCTime(data.blockTimestamp),
            txnId: data.transactionId,
            blockHeight: data.blockHeight,
            listingResourceId: data.data.listingResourceID,
            nftBuyer: (transferEvents[1].data as NFTDeposit).to,
            nftSeller: (transferEvents[0].data as NFTWithdraw).from
        };

        Logger.info(`Creating Sale Event: ${JSON.stringify(createSaleArgs)}`);

        await marketEventService.createSaleEvent(createSaleArgs);

        Logger.info(`Created Sale Event: ${JSON.stringify(createSaleArgs)}`);

        await this.removeListingFromSale(marketEventService, {
            collectionId,
            listingResourceId: data.data.listingResourceID,
            storeId,
        });

    }

    async removeListingFromSale(marketEventService: MarketEventService, args: RemoveListingFromSale) {
        const doesListingExists = await marketEventService.doesListingExists({
            collectionId: args.collectionId,
            listingResourceId: args.listingResourceId,
            storeId: args.storeId,
            isListingActiveForSale: true
        });
        if (doesListingExists) {
            await marketEventService.removeListingFromSale(args); 
            Logger.info(`Removed Listing from sale: ${args.listingResourceId}`);
        }
    }



    async createDeListedEvent(
        collectionId: string, 
        storeId: string,
        marketEventService: MarketEventService,
        data: FlowCapturedEvent<ListingCompletedData>
    ) {
        const createDeListedArgs: CreateDeListedEventDto = {
            collectionId,
            storeId,
            nftType: data.data.nftType.typeID,
            nftUUID: data.data.nftUUID,
            nftID: data.data.nftID,
            salePrice: stringToBigInt(data.data.salePrice),
            salePaymentVaultType: data.data.salePaymentVaultType.typeID,
            timestamp: getUTCTime(data.blockTimestamp),
            txnId: data.transactionId,
            blockHeight: data.blockHeight,
            listingResourceId: data.data.listingResourceID,
        };

        Logger.info(`Creating DeListed event: ${JSON.stringify(createDeListedArgs)}`);

        await marketEventService.createDeListedEvent(createDeListedArgs);

        Logger.info(`Created DeListed event: ${JSON.stringify(createDeListedArgs)}`);

        await this.removeListingFromSale(marketEventService, {
            collectionId,
            listingResourceId: data.data.listingResourceID,
            storeId,
        });


    }

    handle = async (job?: Job<FlowCapturedEvent<ListingCompletedData>>, prisma?: PrismaClient) => {
        if(!prisma) throw new Error("Prisma client muse be defined.");
        const data = this.payload as any as FlowCapturedEvent<ListingCompletedData>;
        if (bannedCollections.includes(getContractId(data.data.nftType.typeID))) {
            return;
        }
        
        try {
            const status  = await fcl.send([
                await fcl.build([
                     fcl.getTransactionStatus(data.transactionId)
                ])
            ])
            .then(fcl.decode);
     
            const transferEvents = this.findWithdrawAndDepositEvent(getContractId(data.data.nftType.typeID), status.events);

            const collectionId = getContractId(data.data.nftType.typeID);
            const storeId = getContractId(data.type);
        
            const listedCollectionService = new ListedCollectionService(prisma);
            const marketEventService = new MarketEventService(prisma);

            if((await listedCollectionService.findListedCollection(collectionId)) === null) {
                await listedCollectionService.createListedCollection(collectionId);
            }

            if (transferEvents.length === 2 && data.data.purchased) {
                await this.createSaleEvent(
                    collectionId,
                    storeId,
                    marketEventService,
                    data,
                    transferEvents
                );
            } else if (!data.data.purchased) {
                await this.createDeListedEvent(
                    collectionId,
                    storeId,
                    marketEventService,
                    data
                );
            }



        } catch(e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
                // P2022: Unique constraint failed
                Logger.info(`Listing already exists.`);
            }else{
                Logger.error(`ListingCompletedJob: ${e}`);
            }
        }

    }
}