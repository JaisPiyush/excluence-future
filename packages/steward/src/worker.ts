import {Job, Worker} from "bullmq";
import { isEmpty } from "lodash";

import { connection, concurrency } from "./config";
import { BaseJob, getJobInstance } from "./jobs";
import { JobImp } from "./jobs";
import {Logger} from "logger";
import { PrismaClient } from "scanner-store";

import * as fcl from "@onflow/fcl";


export interface WorkerReply {
    status: number;
    message: string;
}

fcl.config({
    "accessNode.api": process.env['NEXT_PUBLIC_FLOW_ACCESS_NODE']
})

export const defaultWorker = (queueName: string, prisma: PrismaClient) => {
    const worker = new Worker<JobImp, WorkerReply>(
        queueName,
        async (job: Job) => {
            
            const instance = getJobInstance(job.data);
            if (isEmpty(instance)) {
                throw new Error(`Unable to find Job: ${job.data.name}`);
            }
            await prisma.$connect();
            await instance.handle(job, prisma);
            await prisma.$disconnect();
            return {status: 200, message: "success"};     
        },
        {
            concurrency,
            connection
        }
    );


    worker.on("failed", (job: any, 
                        _err: Error, prev: string) => {
        const instance = getJobInstance(job.data);
        
        if (instance && instance instanceof BaseJob) {
            instance.failed(job).then(() => {});
        }
        Logger.error(`${job.id} has failed`);
    })
}