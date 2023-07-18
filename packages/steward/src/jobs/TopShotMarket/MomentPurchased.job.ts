import { DefaultArgs } from "@prisma/client/runtime";
import { PrismaClient, Prisma, MarketEventService } from "scanner-store";
import { ListingCompletedJob } from "../ListingCompleted.job";
import { FlowCapturedEvent } from "../types";

interface MomentPurchased {
    id: number;
    price: number;
    seller: string;
}

interface MomentWithdrawn {
    id: number;
    owner: string;
}

export type TopShotMomentPurchaseOrDelist = MomentPurchased | MomentWithdrawn;

export class TopShotMomentPurchasedJob extends ListingCompletedJob {

    preDataTransform(data: FlowCapturedEvent<any>, prisma?: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined, DefaultArgs> | undefined): Promise<FlowCapturedEvent<any>> {
        if (!prisma) throw Error("Prisma Client is required");
        const marketEventService = new MarketEventService(prisma);

        const lastListing = 
    }
}