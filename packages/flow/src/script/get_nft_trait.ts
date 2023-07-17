import * as fcl from "@onflow/fcl"


interface Trait extends Record<string, unknown> {
    name: string;
    value: any;
}


const cadence = `import NonFungibleToken from 0x1d7e57aa55817448
import MetadataViews from 0x1d7e57aa55817448

pub fun main(address: Address, collectionPublicPathIdentifier: String, id: UInt64): [MetadataViews.Trait] {
    let account = getAccount(address)
    let collection = account.getCapability(PublicPath(identifier: collectionPublicPathIdentifier)!)
        .borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow a refrence to collection")
    let nft = collection.borrowNFT(id: id)
    let traits = nft.resolveView(Type<MetadataViews.Traits>())! as! MetadataViews.Traits
    return  traits.traits
    
}`

export async function getNFTTraits(address: string, publicPath: string, id: number) {
    return await fcl.query({
        cadence: cadence,
        args: (arg, t) => [
            arg(address, t.Address),
            arg(publicPath, t.String),
            arg(id.toString(), t.UInt64)
        ]
    }) as Trait[];
}