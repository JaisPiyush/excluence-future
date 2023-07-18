import { Request, ResponseToolkit, Server, ServerApplicationState } from "@hapi/hapi";
import { BaseApiModule } from "./base";
import { IndexableCollectionService, IndexedCollectionNFTService, ListedCollectionMetadataService, MarketEventService, PrismaClient } from "scanner-store";

export class NFTAPIModule extends BaseApiModule {
    private readonly marketEventService: MarketEventService;
    private readonly listedCollectionMetadataService: ListedCollectionMetadataService;
    private readonly  indexableCollectionService: IndexableCollectionService;
    private readonly indexedCollectionNFTService: IndexedCollectionNFTService

    constructor(public readonly prisma: PrismaClient) { 
        super(prisma);
        this.marketEventService = new MarketEventService(prisma);
        this.listedCollectionMetadataService = new ListedCollectionMetadataService(prisma);
        this.indexableCollectionService = new IndexableCollectionService(prisma);
        this.indexedCollectionNFTService = new IndexedCollectionNFTService(prisma)

    }

    registerHandle(server: Server<ServerApplicationState>): void {
        server.route({
            method: 'GET',
            path: '/nft/{collectionId}/trait',
            handler: this.getNFTWithTraits
        });
        server.route({
            method: 'GET',
            path: '/nft/{collectionId}/{nftID}',
            handler: this.getNFTDetails
        })
    }

    getNFTWithTraits = async (req: Request, res: ResponseToolkit) => {
        const collectionId = req.params.collectionId as string;
        const traitNames = (req.query.traits as string).split(",");
        const nfts = await this.prisma.nFTTraitAndNFT.findMany({
            where: {
                traitName: {
                    in: traitNames
                },
                collectionId
            },
            select: {
                nftID: true,
                traitValue: true,
                traitName: true
            }
        });

        return res.response({
            data: {
                collectionId: collectionId,
                nfts: nfts.map((nft) => ({
                    traitValue: nft.traitValue,
                    traitName: nft.traitName,
                    nftID: Number(nft.nftID)
                }))
            }
        }).code(200)
    }

    getRarityScore(totalNFTCount: number, traits: {traitName: string, traitValue: string}[], traitsStats: Record<string, Record<string, number>>) {
        
        let rarityScore = 1
        
        for (const trait of traits) {
            const traitStats = traitsStats[trait.traitName];
            const traitValueCount = traitStats[trait.traitValue];
            rarityScore = rarityScore * (traitValueCount / (traitStats['__total__'] * totalNFTCount))
        }

        return rarityScore;
    }

    getNFTTraits = async (collectionId: string, nftID: number) => {
        return await this.prisma.nFTTraitAndNFT.findMany({
            where: {
                collectionId,
                nftID
            },
            select: {
                traitName: true,
                traitValue: true
            }
        });
    }

    getNFTDetails = async (req: Request, res: ResponseToolkit) => {
        const collectionId = req.params.collectionId as string;
        const nftID = Number(req.params.nftID);
        const fields = (req.query.fields || "details").split(",") as string[]

        let data: Record<string, unknown> = {};

       try {
            const ownerHistory = (await this.indexedCollectionNFTService.getOwnerHistoryOfNFT(
                collectionId, nftID
            )).map((owner) => ({
                owner: owner.owner,
                timestamp: owner.timestamp
            }))

            data['currentOwner'] = ownerHistory[0];
            
            if (fields.includes("ownersHistory")) {
                data['ownersHistory'] = ownerHistory
            }

            if (fields.includes("listing")) {
                const listings = await this.prisma.marketEvent.findMany({
                    where: {
                        collectionId,
                        nftID,
                        eventType: "Listing",
                        isListingActiveForSale: true
                    },
                    select: {
                        storeId: true,
                        salePrice: true,
                        salePaymentVaultType: true,
                        timestamp: true,
                        listingResourceId: true,
                        storeFrontAddress: true
                    }
                });

                data['listings'] = listings.map((listing) => ({
                    ...listing,
                    listingResourceId: Number(listing.listingResourceId),
                    salePrice: Number(listing.salePrice)/ Math.pow(10, 8)
                }))

            }

            if (fields.includes("sales")) {
                const sales = await this.prisma.marketEvent.findMany({
                    where: {
                        collectionId,
                        nftID,
                        eventType: 'Sale',
                        purchased: true
                    },
                    select: {
                        storeId: true,
                        salePaymentVaultType: true,
                        salePrice: true,
                        timestamp: true,
                        nftBuyer: true,
                        nftSeller: true,
                        listingResourceId: true
                    }
                });
                data['sales'] = sales.map((sale) => ({
                    ...sale,
                    listingResourceId: Number(sale.listingResourceId),
                    salePrice: Number(sale.salePrice) / Math.pow(10, 8)
                }))
            }

            let traits: {traitName: string, traitValue: string}[] = []

            if (fields.includes('traits')) {
                traits = await this.getNFTTraits(collectionId, nftID)

                data['traits'] = traits
            }

            if (fields.includes('rarity')) {
                const traitsCollections = await this.indexableCollectionService.getAllNFTTraitsStats(collectionId);
        
                const traitsStats: Record<string, Record<string, number>> = {};

                for (const trait of traitsCollections) {
                    if (!traitsStats[trait.traitName]) {
                        traitsStats[trait.traitName] = {'__total__': 0}
                    }
                    traitsStats[trait.traitName][trait.traitValue] = trait._count._all;
                    traitsStats[trait.traitName]['__total__'] += trait._count._all
                }

                const totalNFTCount = await this.indexedCollectionNFTService.getTotalCollectionNFTCount(collectionId);

                if (traits.length === 0) {
                    traits = await this.getNFTTraits(collectionId, nftID)
                }
                const rarityScore = this.getRarityScore(
                    Number(totalNFTCount._count._all),
                    traits,
                    traitsStats
                );
                
                data['rarity'] = rarityScore
            }

            return res.response({data}).code(200)
       }catch(e) {
        console.log(e)
       }


    }


}