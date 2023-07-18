import NonFungibleToken from "../interfaces/NonFungibleToken.cdc"
import MetadataViews from "../interfaces/MetadataViews.cdc"

pub fun main(address: Address, collectionPublicPathIdentifier: String, id: UInt64): [MetadataViews.Trait] {
    let account = getAccount(address)
    let collection = account.getCapability(PublicPath(identifier: collectionPublicPathIdentifier)!)
        .borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow a refrence to collection")
    let nft = collection.borrowNFT(id: id)
    let traits = nft.resolveView(Type<MetadataViews.Traits>()) as! MetadataViews.Traits
    return  traits.traits
    
}