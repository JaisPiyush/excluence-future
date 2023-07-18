import { IndexableCollectionService, IndexedCollectionNFTService, ListedCollectionMetadataService, MarketEventService, PrismaClient } from "scanner-store";
import { BaseApiModule } from "./base";
import { ResponseToolkit, Server, ServerApplicationState, Request } from "@hapi/hapi";

export class CollectionAPIModule extends BaseApiModule {

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
            path: '/collection',
            handler: this.get
        })
        server.route({
            method: 'GET',
            path: '/collection/{collectionId}',
            handler: this.getDetails
        })
    }

    getPeriod(filter?: string): [string] {
        if (filter) {
           
            switch(filter) {
                case "d":
                    return ["day"];
                case "h":
                    return ["hour"];
                case "min":
                    return ["minute"];
                case "week": 
                    return ["week"];
                case "month": 
                    return ["month"];
            }
        }
        return ["day"]
    }

    // period = 1min, 1h, 1day, 1week,1month
    get = async (req: Request, res: ResponseToolkit) => {
        const query = req.query.period as string | undefined;
        const period: [string] = this.getPeriod(query);
        const date = new Date(Date.now())
        
        const collections = await this.marketEventService.getTrendingCollectionData(
            period[0],
        
        );
        console.log(collections);
        return res.response({
            data: collections.map((collection) => {
                return {
                    collectionId: collection.collectionId,
                    period: query || '7d',
                    timestamp: collection.date_trunc,
                    market: {
                        volume: collection.volume ? Number(collection.volume) : 0,
                        avgprice: collection.avgprice? Number(collection.avgprice): 0,
                        listings: collection.listings? Number(collection.listings): 0,
                        sales: collection.count? Number(collection.count): 0,
                        previous_period_volume: Number(collection.volume_change),
                        previous_period_sales: Number(collection.sales_change)
                    },
                    details: {
                        collectionId: collection.collectionId,
                        name: collection.collectionName,
                        squareImage: collection.squareImage
                    }
                }
            })
        }).code(200)
    }

    getDetails = async (req: Request, res: ResponseToolkit) => {
        const collectionId = req.params.collectionId as string;
        const traitsCollections = await this.indexableCollectionService.getAllNFTTraitsStats(collectionId);
        const traits: string[] = [];
        const traitsStats: Record<string, Record<string, number>> = {};

        for (const trait of traitsCollections) {
            if (!traits.includes(trait.traitName)) {
                traits.push(trait.traitName);
            }
            if (!traitsStats[trait.traitName]) {
                traitsStats[trait.traitName] = {'__total__': 0}
            }
            traitsStats[trait.traitName][trait.traitValue] = trait._count._all;
            traitsStats[trait.traitName]['__total__'] += trait._count._all
        }

        const metadata = await this.listedCollectionMetadataService.getLCMD(collectionId)
        const nfts = (await this.indexedCollectionNFTService.findAllNFTInCollection(collectionId)).map((nft) => Number(nft.nftID))
      
        return res.response({data: {
            collectionId: collectionId,
            collectionData: metadata,
            traits: traits,
            traitsStats: traitsStats,
            nftIDs: nfts
        }}).code(200)
    }
}