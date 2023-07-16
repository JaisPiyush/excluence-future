export type FlowUser =  {addr?: string, loggedIn: boolean | null} & Record<string, unknown>

export interface FlowAccount extends Record<string, unknown> {
    address: string;
    balance: number;

}

export type SuspenseWrapperResponse<T> = {read: () => T};

export interface MarketCollectionRow {
    collectionId: string;
    collectionName: string;
    squareImage: string;
    avgSalePrice: number;
    volume: number;
    sales: number;
}