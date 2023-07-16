import NonFungibleToken from "../interfaces/NonFungibleToken.cdc"
import MetadataViews from "../interfaces/MetadataViews.cdc"


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

pub fun main(address: Address ,id: UInt64): NFTCollectionData {
    let account = getAccount(address);

    let collection = account.getCapability(NonFungibleToken.CollectionPublicPath)
        .borrow<&{MetadataViews.ResolverCollection, NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow a reference to the collection")
    
    let viewResolver = collection.borrowViewResolver(id: id)
    let collectionData = MetadataViews.getNFTCollectionData(viewResolver)!
    let collectionDisplay = MetadataViews.getNFTCollectionDisplay(viewResolver)!

    return  NFTCollectionData(
        collectionPublicPath: collectionData.publicPath, 
        collectionStoragePath: collectionData.storagePath, 
        collectionProviderPath: collectionData.providerPath, 
        collectionPublic: collectionData.publicLinkedType.identifier, 
        collectionName: collectionDisplay.name, 
        collectionDescription: collectionDisplay.description, 
        collectionExternalURL: collectionDisplay.externalURL.url, 
        collectionSquareImage: collectionDisplay.squareImage.file.uri(), 
        collectionBannerImage: collectionDisplay.bannerImage.file.uri()
    )
    
}