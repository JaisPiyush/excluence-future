
import { PrismaClient } from '@prisma/client';
import { NFTCollectionService } from './nftCollection.service';
import { StoreFrontService } from '../storeFront/storeFront.service';
import { CreateNFTCollectionDto } from './nftCollection.dto';
import { CreateStoreFrontDto } from '../storeFront/storeFront.dto';



let nftCollectionService: NFTCollectionService;
let storeFrontService: StoreFrontService
const storeFront: CreateStoreFrontDto = {
    version: 2,
    address: '0x01',
    publicPath: 'NFTStoreFrontV2PublicPath',
    storagePath: 'NFTStoreFrontV2StoragePath'
}

beforeAll(async () => {
    nftCollectionService = new NFTCollectionService(new PrismaClient());
    storeFrontService = new StoreFrontService(nftCollectionService.prisma);
    await storeFrontService.createStoreFront(storeFront);

})

describe('Testing NFTCollectionService', () => { 
    test('should create NFTCollection and NFTCollectionOnStoreFronts', async () => {
        const nftCollectionDto: CreateNFTCollectionDto = {
            address: 'A.0x03.AllDay',
            publicPath: 'AllDayPublicPath',
            storagePath: 'AllDayStoragePath',
            storeFrontAddress: '0x01'
        }

        const nftCollection = await nftCollectionService.createNFTCollection(nftCollectionDto);
        const nFTCollectionOnStoreFronts = await nftCollectionService.prisma.nFTCollectionOnStoreFronts.findFirst({
            where: {
                nftCollectionId: nftCollectionDto.address
            }
        });
        expect(nFTCollectionOnStoreFronts).not.toBe(null);
        expect(nFTCollectionOnStoreFronts?.nftCollectionId).toEqual(nftCollection.address)
        expect(nFTCollectionOnStoreFronts?.storFrontId).toEqual(storeFront.address);

    });

    test('should return nftCollection', async () => {
        expect(await nftCollectionService.getNFTCollectionByAddress('A.0x03.AllDay')).not.toBe(null)
    })
})

afterAll(async () => {
    await nftCollectionService.prisma.$transaction([
        nftCollectionService.prisma.nFTCollectionOnStoreFronts.deleteMany(),
        nftCollectionService.prisma.nFTCollection.deleteMany(),
        storeFrontService.prisma.storeFront.deleteMany()
    ]);

    await nftCollectionService.prisma.$disconnect()
})
