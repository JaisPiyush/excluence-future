export enum FlowAccessNode {
    Testnet = "testnet",
    Mainnet = "mainnet"
}

export const flowNetworkConfigs = {
    [FlowAccessNode.Mainnet] : "https://mainnet.onflow.org",
    [FlowAccessNode.Testnet] : "https://testnet.onflow.org"
}