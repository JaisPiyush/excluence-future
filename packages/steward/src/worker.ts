import {Job, Worker} from "bullmq";
import { isEmpty } from "lodash";

import { connection, concurrency } from "./config";
import { getJobInstance } from "./jobs";
import { JobImp } from "./jobs";
import {Logger} from "logger";


export interface WorkerReply {
    status: number;
    message: string;
}

export const defaultWorker = (queueName: string) => {
    const worker = new Worker<JobImp, WorkerReply>(
        queueName,
        async (job: Job) => {
            const instance = getJobInstance(job.data);
            if (isEmpty(instance)) {
                throw new Error(`Unable to find Job: ${job.data.name}`);
            }
            instance.handle();
            return {status: 200, message: "success"}
        },
        {
            concurrency,
            connection
        }
    );


    worker.on("failed", (job: Job) => {
        const instance = getJobInstance(job.data);
        instance?.failed(job);
        Logger.info(`${job.id} has failed`);
    })
}