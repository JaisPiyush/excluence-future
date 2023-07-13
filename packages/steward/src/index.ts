import { Queue} from "bullmq";
import { connection } from "./config";
import { defaultWorker } from "./worker";
import { getPrismaClient } from "scanner-store";

export const defaultQueueName = "events-queue";

export const defaultQueue = new Queue(defaultQueueName, {
    connection
});

export async function setupBullMQProcess(queueName = defaultQueueName) {
    const prisma = getPrismaClient();
    await defaultWorker(queueName, prisma);
}