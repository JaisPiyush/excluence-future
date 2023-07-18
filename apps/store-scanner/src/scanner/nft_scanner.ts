import {FlowScanner} from 'flow-scanner-lib'
import {ConfigProvider} from 'flow-scanner-lib/lib/providers/config-provider'
import { FlowAccessNode, flowNetworkConfigs } from '../config'
import { getEventName } from './events'
import { Logger } from 'logger'
import { setupBullMQProcess } from 'steward'
import { QueueEventBroadcaster } from './event-broadcaster'
import { IndexableCollectionService, StoreService, getPrismaClient } from 'scanner-store'
import { PrismaDBSettingService } from './db-settings-service'
import { getQueueName } from './queue'
import { logger } from './logger'


const flowNetwork = process.env['NEXT_PUBLIC_FLOW_NETWORK'] || FlowAccessNode.Mainnet;



const prisma = getPrismaClient();


const eventBroadcaster = new QueueEventBroadcaster();




export const main = async () => {

    const storeService = new StoreService(prisma);
    const indexableCollectionService = new IndexableCollectionService(prisma);
    const worker = await setupBullMQProcess(getQueueName());

    const indexableCollections =  await indexableCollectionService.findAll();

    const indexableCollectionsScanner = await Promise.all(indexableCollections.map(async (indexableCollection) => {
        Logger.info(`Scanner for Collection ${indexableCollection.address}`)
        
        const configProvider: ConfigProvider = () => ({
            defaultStartBlockHeight: Number(indexableCollection.startBlockHeight), // this is the block height that the scanner will start from on the very first run
            flowAccessNode: flowNetworkConfigs[flowNetwork as FlowAccessNode],
            maxFlowRequestsPerSecond: 5,
        })
        const settingsService = new PrismaDBSettingService(
            `${flowNetwork}_${indexableCollection.address}`,
            prisma,
            true
        );

        // const settingsService = new MemorySettingsService()

        const events = [`${indexableCollection.address}.Deposit`]
        // console.log(events)

        const flowScanner = new FlowScanner(
            // event types to monitor
            events,
            // pass in the configured providers
            {
                configProvider: configProvider,
                eventBroadcasterProvider: async () => eventBroadcaster,
                settingsServiceProvider: async () => settingsService,
                logProvider: logger,
                
            }
        );
        await settingsService.initProcessedHeight(configProvider().defaultStartBlockHeight || 0)
        
   
        await flowScanner.start();
       
        return flowScanner;
    }))

    // wait for interrupt signal
    await new Promise<void>(resolve => {
        // listen for SIGTERM to stop the scanner
        process.on('SIGTERM', () => {
            Logger.info('Received SIGTERM')
            resolve()
        })

        process.on('SIGINT', () => {
            Logger.info('Received SIGINT')
            resolve()
        })

        process.on('uncaughtException', (e) => {
            Logger.error(e);
            resolve();
        });

        process.on('unhandledRejection', (e) => {
            Logger.error(e);
            resolve();
        })
    })


    Logger.info('Stopping scanner')
    await Promise.all(indexableCollectionsScanner.map( async (flowScanner) => {
        return await flowScanner.stop();
    }));
    Logger.info('Closing worker: ' + worker.id)
    await worker.close();
    process.exit(0)
}

main()