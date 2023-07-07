
import { PrismaClient } from '@prisma/client';
import { NFTCollectionService } from './nftCollection.service';
import { StoreFrontService } from '../storeFront/storeFront.service';
import { CreateNFTCollectionDto } from './nftCollection.dto';
import { CreateStoreFrontDto } from '../storeFront/storeFront.dto';



let nftCollectionService: NFTCollectionService;
let storeFrontService: StoreFrontService
const storeFront: CreateStoreFrontDto = {
    version: 2,
    address: '0x02',
    publicPath: 'NFTStoreFrontV2PublicPath',
    storagePath: 'NFTStoreFrontV2StoragePath'
}

beforeEach(async () => {
    nftCollectionService = new NFTCollectionService(new PrismaClient());
    storeFrontService = new StoreFrontService(nftCollectionService.prisma);
    await storeFrontService.createStoreFront(storeFront);

})

describe('Testing NFTCollectionService', () => { 
    test('should create NFTCollection and NFTCollectionOnStoreFronts', async () => {
        const nftCollectionDto: CreateNFTCollectionDto = {
            address: 'A.0x02.AllDay',
            publicPath: 'AllDayPublicPath',
            storagePath: 'AllDayStoragePath',
            storeFrontAddress: '0x02'
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

    })
})

afterAll(async () => {
    nftCollectionService.prisma.nFTCollection.deleteMany();
    nftCollectionService.prisma.nFTCollectionOnStoreFronts.deleteMany();
})
