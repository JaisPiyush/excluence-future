import { CreateIndexedCollectionNFT, IndexedCollectionNFTService, PrismaClient } from "scanner-store";
import { BaseApiModule } from "./base";
import { Request, ResponseToolkit, Server, ServerApplicationState } from "@hapi/hapi";

export class IndexedCollectionNFT extends BaseApiModule {

    private readonly indexedCollectionNFTService: IndexedCollectionNFTService;

    constructor(public readonly prisma: PrismaClient) {
        super(prisma);
        this.indexedCollectionNFTService = new IndexedCollectionNFTService(prisma)

    }

    registerHandle(server: Server<ServerApplicationState>): void {
        server.route({
            method: 'POST',
            path: '/nft',
            handler: this.create
        });

        server.route({
            method: 'GET',
            path: '/nft/{collectionId}',
            handler: this.findAllNFTInCollection
        });

        server.route({
            method: 'GET',
            path: '/nft/{collectionId}/traits',
            handler: this.findAllCollectionTraits
        });

        server.route({
            method: 'GET',
            path: '/nft/{collectionId}/traits/{nftID}',
            handler: this.findAllNFTTraits
        })
    }

    create = async (req: Request, res: ResponseToolkit) => {
       try {
        const payload = req.payload as CreateIndexedCollectionNFT;
        const nft = await this.indexedCollectionNFTService.create(payload);

        return res.response({data: {
            ...nft,
            nftID: Number(nft.nftID)
        }}).code(201)
       }catch (e) {
        console.log(e)
        return res.response({error: "true"})
       }
    }

    findAllNFTInCollection = async (req: Request, res: ResponseToolkit) => {
        try {
            const collectionId = req.params.collectionId as string;
            const nfts = await this.indexedCollectionNFTService.findAllNFTInCollection(collectionId);
       
            return res.response({data: nfts.map((nft) => {
                return {
                    ...nft,
                    nftID: Number(nft.nftID)
                }
            })}).code(200)
        }catch (e) {
            console.log(e)
            return res.response({error: "true"})
           }
    }

    findAllCollectionTraits = async (req: Request, res: ResponseToolkit) => {
        const collectionId = req.params.collectionId as string;
        const nfts = await this.indexedCollectionNFTService.getAllCollectionTraits(collectionId);
        return res.response({data: nfts.map((nft) => {
            return {
                ...nft,
                nftID: Number(nft.nftID)
            }
        })}).code(200)
    }

    findAllNFTTraits = async (req: Request, res: ResponseToolkit) => {
        const collectionId = req.params.collectionId as string;
        const nftId = req.params.nftID as string
        const nfts = await this.indexedCollectionNFTService.getAllNFTTraits(
            collectionId,
            parseInt(nftId)
        )

        return res.response({data: nfts.map((nft) => {
            return {
                ...nft,
                nftID: Number(nft.nftID)
            }
        })}).code(200)
    }
}