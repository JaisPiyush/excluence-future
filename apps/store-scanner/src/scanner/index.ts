import {FlowScanner} from '@rayvin-flow/flow-scanner-lib'
import {ConfigProvider} from '@rayvin-flow/flow-scanner-lib/lib/providers/config-provider'
import { FlowEvent } from '@rayvin-flow/flow-scanner-lib/lib/flow/models/flow-event'
import { EventBroadcasterInterface } from '@rayvin-flow/flow-scanner-lib/lib/broadcaster/event-broadcaster'
import { FlowAccessNode, flowNetworkConfigs } from '../config'



// create provider for configuration 
const configProvider: ConfigProvider = () => ({
    defaultStartBlockHeight: 0, // this is the block height that the scanner will start from on the very first run
    flowAccessNode: flowNetworkConfigs[FlowAccessNode.Testnet],
    maxFlowRequestsPerSecond: 10
})