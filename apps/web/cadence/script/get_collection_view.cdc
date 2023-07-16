import MetadataViews from 0x1d7e57aa55817448
import ViewResolver from 0x1d7e57aa55817448


pub struct NFTCollectionData {
    pub let collectionName: String
    pub let collectionDescription: String
    pub let collectionExternalURL: String
    pub let collectionSquareImage: String
    pub let collectionBannerImage: String
    pub let collectionPublicPath: PublicPath
    pub let collectionStoragePath: StoragePath
    pub let collectionProviderPath: PrivatePath
    pub let collectionPublic: String

    init(
        collectionPublicPath: PublicPath,
        collectionStoragePath: StoragePath,
        collectionProviderPath: PrivatePath,
        collectionPublic: String,
        collectionName: String,
        collectionDescription: String,
        collectionExternalURL: String,
        collectionSquareImage: String,
        collectionBannerImage: String,
    ) {
        self.collectionPublicPath = collectionPublicPath
        self.collectionStoragePath = collectionStoragePath
        self.collectionProviderPath = collectionProviderPath
        self.collectionPublic = collectionPublic
        self.collectionName = collectionName
        self.collectionDescription = collectionDescription
        self.collectionExternalURL = collectionExternalURL
        self.collectionSquareImage = collectionSquareImage
        self.collectionBannerImage = collectionBannerImage
    }

}

pub fun main(address: Address, contractName: String): NFTCollectionData {
    let account = getAccount(address)

    let contract = account.contracts.borrow<&ViewResolver>(name: contractName)!

    let display = contract.resolveView(Type<MetadataViews.NFTCollectionDisplay>())! as! MetadataViews.NFTCollectionDisplay;

     let nftCollectionData = contract.resolveView(Type<MetadataViews.NFTCollectionData>())! as! MetadataViews.NFTCollectionData;

    return NFTCollectionData(
            collectionPublicPath: nftCollectionData.publicPath, 
            collectionStoragePath: nftCollectionData.storagePath, 
            collectionProviderPath: nftCollectionData.providerPath, 
            collectionPublic: nftCollectionData.publicCollection.identifier,
            collectionName: display.name, 
            collectionDescription: display.description, 
            collectionExternalURL: display.externalURL.url, 
            collectionSquareImage: display.squareImage.file.uri(), 
            collectionBannerImage: display.bannerImage.file.uri()
        )
}