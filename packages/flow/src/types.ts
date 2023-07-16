export interface FlowPath<T = "public" | "private" | "storage"> {
    domain: T;
    identifier: string;
}

export interface MediaFile {
    file: {
        url: string
    };
    mediaType: string
}

export interface CollectionViewData extends Record<string, unknown> {
    contractName: string;
    contractAddress: string;
    nftType: {
        type: string;
        kind: string;
        typeID: string;
        fields: Array<any>;
        initializers: Array<any>
    },
    collectionData: {
        privatePath: FlowPath<"private">;
        publicPath: FlowPath<"public">;
        storagePath: FlowPath<"storage">;

    };
    collectionDisplay: {
        bannerImage: MediaFile;
        description: string;
        externalURL: {url: string};
        name: string;
        socials: Record<string, string>;
        squareImage: MediaFile;
    }
}