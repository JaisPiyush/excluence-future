import { Job } from "bullmq";
import { Logger } from "logger";
import { FlowCapturedEvent } from "./types";
import { PrismaClient } from "scanner-store";

export interface JobImp {
    name: string;
    payload?: Record<string, unknown>;
    handle: (job?: Job, prisma?: PrismaClient) => Promise<void>;
    failed: (job?: Job) => Promise<void>;
}

export class BaseJob {
    readonly name: string = this.constructor.name;

    handle = async (job?: Job<FlowCapturedEvent>, prisma?: PrismaClient): Promise<void> => {
        throw new Error("Method not implemented")
    }

    async preDataTransform(data: FlowCapturedEvent, prisma?: PrismaClient): Promise<FlowCapturedEvent> {
        return data;
    }

    failed = async (job?: Job): Promise<void> => {
        Logger.error(`Job(${this.name}) with ID: ${job?.id} has failed`)
    }
}