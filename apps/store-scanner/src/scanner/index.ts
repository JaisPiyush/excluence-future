import {FlowScanner} from '@rayvin-flow/flow-scanner-lib'
import {ConfigProvider} from '@rayvin-flow/flow-scanner-lib/lib/providers/config-provider'
import { FlowAccessNode, flowNetworkConfigs } from '../config'
import {MemorySettingsService} from '@rayvin-flow/flow-scanner-lib/lib/settings/memory-settings-service'
import { getEventName, getEvents } from './events'
import { Logger } from 'logger'
import { createQueue, setupBullMQProcess } from 'steward'
import { QueueEventBroadcaster } from './event-broadcaster'
import { StoreService, getPrismaClient } from 'scanner-store'
import { PrismaDBSettingService } from './db-settings-service'
import { getFormattedQueueName, getQueueName } from './queue'
import { logger } from './logger'

const flowNetwork = process.env['NEXT_PUBLIC_FLOW_NETWORK'] || FlowAccessNode.Mainnet;



const prisma = getPrismaClient();


const eventBroadcaster = new QueueEventBroadcaster();



export const main = async () => {

    const storeService = new StoreService(prisma);
    const flowEvents = await storeService.findAllStoreEvents();

    const flowScanners = await Promise.all(flowEvents.map( async (flowStore) => {
        Logger.info(`Scanner for store ${flowStore.address} is starting!`)
        const configProvider: ConfigProvider = () => ({
            defaultStartBlockHeight: Number(flowStore.startBlockHeight), // this is the block height that the scanner will start from on the very first run
            flowAccessNode: flowNetworkConfigs[flowNetwork as FlowAccessNode],
            maxFlowRequestsPerSecond: 5
        })
        const settingsService = new PrismaDBSettingService(
            `${flowNetwork}_${flowStore.address}`,
            prisma,
            true
        );

        const events = flowStore.StoreEvents.map((event) => getEventName(event))
        // console.log(events)

        const flowScanner = new FlowScanner(
            // event types to monitor
            flowStore.StoreEvents.map((event) => getEventName(event)),
            // pass in the configured providers
            {
                configProvider: configProvider,
                eventBroadcasterProvider: async () => eventBroadcaster,
                settingsServiceProvider: async () => settingsService,
                logProvider: logger
            }
        );
        await settingsService.initProcessedHeight(configProvider().defaultStartBlockHeight || 0)
        await setupBullMQProcess(getQueueName());
        await flowScanner.start();
        return flowScanner;
    }));

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
    await Promise.all(flowScanners.map( async (flowScanner) => {
        return await flowScanner.stop();
    }));
}

