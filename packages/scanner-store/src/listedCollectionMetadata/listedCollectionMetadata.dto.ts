import {CollectionViewData} from "flow-dock/src/types";


export interface CreateListedCollectionMetadataDto {
    collectionId: string;
    publicPath: string;
    privatePath: string;
    storagePath: string;
    contractName: string;
    collectionName: string;
    bannerImage: string | null;
    squareImage: string;
    description: string | null;
    externalURL: string | null;
    socials: Record<string, string>

}

export function getCreateLCMDtoFromCollectionViewData(collectionData: CollectionViewData): CreateListedCollectionMetadataDto {
    
    const _socials: Record<string, string> = {}

    for(const [key, value] of Object.entries(collectionData.collectionDisplay.socials)) {
        _socials[key] = value.url
    }

    return {
        collectionId: `A.${collectionData.contractAddress.replace('0x', '')}.${collectionData.contractName}`,
        publicPath: collectionData.collectionData.publicPath.identifier,
        privatePath: collectionData.collectionData.privatePath.identifier,
        storagePath: collectionData.collectionData.storagePath.identifier,
        contractName: collectionData.contractName,
        collectionName: collectionData.collectionDisplay.name,
        bannerImage: collectionData.collectionDisplay.bannerImage ? collectionData.collectionDisplay.bannerImage.file.url : null,
        squareImage: collectionData.collectionDisplay.squareImage.file.url,
        description: collectionData.collectionDisplay.description || null,
        externalURL: collectionData.collectionDisplay.externalURL ? collectionData.collectionDisplay.externalURL.url : null,
        socials: _socials
    }
}