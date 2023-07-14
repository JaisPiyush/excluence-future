import {FlowScanner} from '@rayvin-flow/flow-scanner-lib'
import {ConfigProvider} from '@rayvin-flow/flow-scanner-lib/lib/providers/config-provider'
import { FlowAccessNode, flowNetworkConfigs } from '../config'
// import { PrismaDBSettingService } from './db-settings-service'
import {MemorySettingsService} from '@rayvin-flow/flow-scanner-lib/lib/settings/memory-settings-service'
import { getEvents } from './events'
// import { logger } from './logger';
import { Logger } from 'logger'
import { setupBullMQProcess } from 'steward'
import { QueueEventBroadcaster } from './event-broadcaster'

const flowNetwork = process.env['NEXT_PUBLIC_FLOW_NETWORK'] || FlowAccessNode.Mainnet;
// create provider for configuration 
const configProvider: ConfigProvider = () => ({
    defaultStartBlockHeight: 56381377, // this is the block height that the scanner will start from on the very first run
    flowAccessNode: flowNetworkConfigs[flowNetwork as FlowAccessNode],
    maxFlowRequestsPerSecond: 10
})


// const prisma = getPrismaClient();

const settingsService = new MemorySettingsService();

const eventBroadcaster = new QueueEventBroadcaster();

const flowScanner = new FlowScanner(
    // event types to monitor
    getEvents(),
    // pass in the configured providers
    {
        configProvider: configProvider,
        eventBroadcasterProvider: async () => eventBroadcaster,
        settingsServiceProvider: async () => settingsService,
    }
);

export const main = async () => {
    // start the scanner
    // this method will return as soon as the scanner has started and continue to run in the background using setTimeout calls
    // the scanner is a very I/O constrained process and not very CPU intensive, so as long as you are not bottlenecking the CPU with
    // your own application logic there should be plenty of room for it to process
    console.log('Starting scanner')
    await setupBullMQProcess();
    await flowScanner.start()

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
    })

    // when you are ready to stop the scanner, you can call the stop() method
    Logger.info('Stopping scanner')
    await flowScanner.stop()
}

