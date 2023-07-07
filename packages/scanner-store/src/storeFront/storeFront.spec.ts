import { MockContext, Context, createMockContext } from '../../context';
// import { beforeEach, test, expe } from "jest";
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
            address: '0x01',
            publicPath: 'NFTStoreV2PublicPath',
            storagePath: 'NFTStoreV2StoragePath'
        }
        const storeFront = await storeFrontService.createStoreFront(storeFrontDto);
        expect(storeFront).toEqual({...storeFrontDto})

    })
 })

 afterAll(async () => {
    await storeFrontService.prisma.storeFront.deleteMany()
 })