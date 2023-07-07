import { PrismaClient } from '@prisma/client'
import { NFTCollectionService } from './src/nftCollection/nftCollection.service'
import { StoreFrontService } from './src/storeFront/storeFront.service';

// Cleanup db in test env
async function main() {
  if (process.env['NODE_ENV'] !== 'test') return
  const prisma = new PrismaClient()
  const nftCollectionService = new NFTCollectionService(prisma);
  const storeFrontService = new StoreFrontService(prisma);

  console.log('Starting DB cleaning')

  storeFrontService.prisma.storeFront.deleteMany();
  nftCollectionService.prisma.nFTCollection.deleteMany();
  nftCollectionService.prisma.nFTCollectionOnStoreFronts.deleteMany();

  console.log('Finished DB cleaning')

}

main()