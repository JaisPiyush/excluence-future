import { IndexedCollectionNFTService, ListedCollectionMetadataService, Prisma, PrismaClient } from "scanner-store";
import { BaseJob, JobImp } from "../job.definition";
import { FlowCapturedEvent } from "../types";
import { Job } from "bullmq";
import { Logger } from "logger";
import { getContractId } from "../utils";
import { getUTCTime } from "../../utils";
import {getNFTTraits} from "flow-dock/src/script/get_nft_trait"

interface Deposit {
    id: number;
    to: string
}

interface Withdraw {
    id: number;
    from: string
}

export class CollectionJob extends BaseJob implements JobImp {

    constructor(public payload: Record<string, unknown>) {
        super();
    }

    handle = async (job?: Job<FlowCapturedEvent<Deposit>>, prisma?: PrismaClient) => {
        if(!prisma) throw new Error("Prisma client muse be defined.");
        try {
            const data = await this.preDataTransform(this.payload as any as FlowCapturedEvent) as FlowCapturedEvent<Deposit>;
            const indexedCollectionService = new IndexedCollectionNFTService(prisma);
            const listedCollectionMetadataService = new ListedCollectionMetadataService(prisma);
            const collectionId = getContractId(data.type);

            if (await indexedCollectionService.hadIndexedNFT(collectionId, Number(data.data.id))) {
                await indexedCollectionService.updateNFTOwner(
                    collectionId,
                    Number(data.data.id),
                    data.data.to,
                    getUTCTime(data.blockTimestamp)
                )

                Logger.info(`Updated owner for NFT ${collectionId}.NFT#${data.data.id} to ${data.data.to}`);
                return 
            }

            const collection = await listedCollectionMetadataService.getLCMD(collectionId);
            if (collection === null) {
                Logger.error(`Collection ${collectionId} does not have metadata`);
            }

            const traits = await getNFTTraits(
                data.data.to,
                collection?.publicPath as string,
                Number(data.data.id)
            );

            await indexedCollectionService.create({
                collectionId,
                nftID: Number(data.data.id),
                owner: data.data.to,
                timestamp: getUTCTime(data.blockTimestamp),
                traits: traits.map((trait) => ({name: trait.name, value: trait.value}))
            });

            Logger.info(`Indexed NFT ${collectionId}.NFT#${data.data.id}`)
         

        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
                // P2022: Unique constraint failed
                Logger.info(`Listing already exists.`)
            }else{
                Logger.error(`${this.name}: ${e}`);
            }
        }
    }
}