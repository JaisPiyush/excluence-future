export interface CreateListingAvailableDto {
    nftId: number;
    collection: string;
    storedFrontAddress: string;
    listingResourceId: number;
    salePrice: number;
    nftUUID: number;
    expiry: number;
    salePaymentVaultType: string;
    blockHeight: number;
    transactionId: string;
    commissionAmount: number;
    timestamp: number;
}