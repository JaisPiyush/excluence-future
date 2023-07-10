export interface CreateStoreDto {
    version: number
    address: string
    storagePath: string;
    publicPath: string;
    startBlockHeight: number;
}