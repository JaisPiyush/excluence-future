import { Job } from "bullmq";

export interface JobImp {
    name: string;
    payload?: Record<string, unknown>;
    handle: (job?: Job) => void;
    failed: (job?: Job) => void;
}

export class BaseJob {
    readonly name: string = this.constructor.name;
}