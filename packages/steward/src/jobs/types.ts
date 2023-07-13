export interface FlowCapturedEvent<T = any> {
    blockId: string
    blockHeight: number;
    blockTimestamp: string;
    type: string;
    transactionId: string;
    transactionIndex: number;
    eventIndex: number;
    data: T
}

export type FlowNamedType = Record<string, unknown> & {
    typeID: string
}