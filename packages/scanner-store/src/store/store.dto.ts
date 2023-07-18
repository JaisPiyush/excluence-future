export interface CreateStoreDto {
    version: number;
    address: string;
    storagePath: string;
    publicPath: string;
    startBlockHeight?: number;
}

export interface CreateStoreWithEventsDto{
    store: CreateStoreDto;
    events: string[]
}