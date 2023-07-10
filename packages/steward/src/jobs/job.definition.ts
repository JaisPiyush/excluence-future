import { Job } from "bullmq";
import { Logger } from "logger";

export interface JobImp {
    name: string;
    payload?: Record<string, unknown>;
    handle: (job?: Job) => Promise<void>;
    failed: (job?: Job) => Promise<void>;
}

export class BaseJob {
    readonly name: string = this.constructor.name;

    handle = async (job?: Job) => {
        throw new Error("Method not implemented")
    }

    failed = async (job?: Job) => {
        Logger.error(`Job(${this.name}) with ID: ${job?.id} has failed`)
    }
}