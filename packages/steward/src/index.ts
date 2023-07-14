import { Queue} from "bullmq";
import { connection } from "./config";
import { defaultWorker } from "./worker";
import { getPrismaClient } from "scanner-store";
import { Logger } from "logger";

export * from "./jobs/utils"

export const defaultQueueName = "events-queue";

export const defaultQueue = new Queue(defaultQueueName, {
    connection
});

export async function setupBullMQProcess(queueName = defaultQueueName) {
    const prisma = getPrismaClient();
    if (process.env["NODE_ENV"] === "test") {
        await defaultQueue.drain();
        Logger.info(`Drained queue`)
    }
    await defaultWorker(queueName, prisma);
}