import { main } from "./scanner";

main();

// import {FlowScanner} from '@rayvin-flow/flow-scanner-lib'
// import {MemorySettingsService} from '@rayvin-flow/flow-scanner-lib/lib/settings/memory-settings-service'
// import {ConfigProvider} from '@rayvin-flow/flow-scanner-lib/lib/providers/config-provider'
// import {ConsoleEventBroadcaster} from '@rayvin-flow/flow-scanner-lib/lib/broadcaster/console-event-broadcaster'
// import { FlowEvent } from '@rayvin-flow/flow-scanner-lib/lib/flow/models/flow-event'
// import { EventBroadcasterInterface } from '@rayvin-flow/flow-scanner-lib/lib/broadcaster/event-broadcaster'
// import { getPrismaClient } from 'scanner-store'
// import { PrismaDBSettingService } from './scanner/db-settings-service'

// // create provider for configuration (these are the minimum required values)
// const configProvider: ConfigProvider = () => ({
//     defaultStartBlockHeight: 56190400, // this is the block height that the scanner will start from on the very first run (undefined to start at the latest block)
//     flowAccessNode: 'https://mainnet.onflow.org', // access node to use for Flow API requests
//     maxFlowRequestsPerSecond: 10, // maximum number of requests to make to the Flow API per second
// })

// const prisma = getPrismaClient()

// // create the service that will persist settings (in this case, it is just in-memory)
// const settingsService = new PrismaDBSettingService("" ,prisma);

// class ExtendedConsoleEventBroadcaster implements EventBroadcasterInterface {
//     broadcastEvents =  async (blockHeight: number, events: FlowEvent[]) : Promise<void> => {
//         console.log(`Broadcasting ${events.length} events: ${JSON.stringify(events[0].data)}`)
//     }
// }

// // the broadcaster that will send all monitored events (this one just outputs information the the console)
// const eventBroadcaster = new ExtendedConsoleEventBroadcaster()

// // create the scanner instance
// const flowScanner = new FlowScanner(
//     // event types to monitor
//     [
//         'A.4eb8a10cb9f87357.NFTStorefrontV2.ListingAvailable',
//     ],
//     // pass in the configured providers
//     {
//         configProvider: configProvider,
//         eventBroadcasterProvider: async () => eventBroadcaster,
//         settingsServiceProvider: async () => settingsService,
//     }
// )

// const main = async () => {
//     // start the scanner
//     // this method will return as soon as the scanner has started and continue to run in the background using setTimeout calls
//     // the scanner is a very I/O constrained process and not very CPU intensive, so as long as you are not bottlenecking the CPU with
//     // your own application logic there should be plenty of room for it to process
//     console.log('Starting scanner')
//     await flowScanner.start()

//     // wait for interrupt signal
//     await new Promise<void>(resolve => {
//         // listen for SIGTERM to stop the scanner
//         process.on('SIGTERM', () => {
//             console.log('Received SIGTERM')
//             resolve()
//         })

//         process.on('SIGINT', () => {
//             console.log('Received SIGINT')
//             resolve()
//         })
//     })

//     // when you are ready to stop the scanner, you can call the stop() method
//     console.log('Stopping scanner')
//     await flowScanner.stop()
// }

// main()