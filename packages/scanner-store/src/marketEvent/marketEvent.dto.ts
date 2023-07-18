export interface CreateListingDto {
    collectionId: string;
    nftType: string;
    nftUUID: number;
    nftID: number;
    salePrice: number | bigint;
    salePaymentVaultType: string;
    storeId: string;
    expiry: number;
    timestamp: Date;
    txnId: string;
    listingResourceId: number;
    storeFrontAddress: string;
    blockHeight: number;
}

export interface CheckListingExistsArgs {
    collectionId: string;
    listingResourceId: number;
    storeId: string;
    isListingActiveForSale?: boolean;
}

export type GetListingArgs = Partial<CreateListingDto>;

export type RemoveListingFromSale = Omit<CheckListingExistsArgs, 
        "isListingActiveForSale">;

export interface CreateSaleEventDto {
    collectionId: string;
    nftType: string;
    nftUUID: number;
    nftID: number;
    salePrice: number | bigint;
    salePaymentVaultType: string;
    storeId: string;
    nftBuyer: string;
    nftSeller: string;
    listingResourceId: number;
    timestamp: Date;
    txnId: string;
    blockHeight: number;
}

export type CreateDeListedEventDto = Omit<CreateSaleEventDto, "nftBuyer" | "nftSeller">;

export interface TrendingCollectionDto {
    squareImage: string;
    collectionName: string;
    avgprice: number | bigint | null;
    volume: number | bigint | null;
    listings: number | bigint | null;
    count: number | bigint | null;
    date_trunc: string;
    volume_chg: number;
    sales_chg: number;
}

export enum Durations {
    day = 'day',
    hour = 'hour'
}