import NFTCatalog from 0x49a7cda3a1eecc29
// import MetadataViews from "../interfaces/MetadataViews.cdc"

pub fun main(collectionId: String): NFTCatalog.NFTCatalog.NFTCatalogMetadata {
    return NFTCatalog.getCatalogEntry(collectionId)
}