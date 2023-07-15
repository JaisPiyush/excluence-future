import { Queue, createQueue } from "steward";
import { FlowAccessNode } from "../config";

export const queueForMainnetName = "mainnet-event-queue";
export const queueForTestnetName = "testnet-event-queue";

export const mainnetQueue = createQueue(queueForMainnetName);
export const testnetQueue = createQueue(queueForTestnetName);

export function getQueue(): Queue {
    const flowNetwork = process.env['NEXT_PUBLIC_FLOW_NETWORK'] || FlowAccessNode.Mainnet;
    if (flowNetwork === FlowAccessNode.Testnet) return testnetQueue;
    return mainnetQueue;
}

export function getQueueName(): string { 
    const flowNetwork = process.env['NEXT_PUBLIC_FLOW_NETWORK'] || FlowAccessNode.Mainnet;
    if (flowNetwork === FlowAccessNode.Testnet) return queueForTestnetName;
    return queueForMainnetName;
}
