export interface CreateListingDto {
    collectionId: string;
    nftType: string;
    nftUUID: number;
    nftID: number;
    salePrice: number;
    salePaymentVaultType: string;
    storeId: string;
    expiry: number;
    timestamp: number;
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
    salePrice: number;
    salePaymentVaultType: string;
    storeId: string;
    nftBuyer: string;
    nftSeller: string;
    listingResourceId: number;
    timestamp: number;
    txnId: string;
    blockHeight: number;
}

export type CreateDeListedEventDto = CreateSaleEventDto;

