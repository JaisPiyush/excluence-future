import { StoreFrontService } from './storeFront.service';
import { CreateStoreFrontDto } from './storeFront.dto';
import { PrismaClient } from '@prisma/client';

let storeFrontService: StoreFrontService;

beforeEach(() => {
    storeFrontService = new StoreFrontService(new PrismaClient());
})

describe('StoreFront testing', () => { 
    test('should create a new store front', async () => {
        const storeFrontDto: CreateStoreFrontDto = {
            version: 2,
            address: '0x02',
            publicPath: 'NFTStoreV2PublicPath',
            storagePath: 'NFTStoreV2StoragePath'
        }
        const storeFront = await storeFrontService.createStoreFront(storeFrontDto);
        expect(storeFront).toEqual({...storeFrontDto})

    })
 })

 afterAll(async () => {
    await storeFrontService.prisma.$transaction([
        storeFrontService.prisma.storeFront.deleteMany()
    ]);

    await storeFrontService.prisma.$disconnect();
 })