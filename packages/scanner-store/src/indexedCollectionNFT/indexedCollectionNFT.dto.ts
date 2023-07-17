export interface CreateIndexedCollectionNFT {
    collectionId: string;
    nftID: number;
    owner: string;
    traits: {name: string, value: any}[];
    timestamp: Date
}