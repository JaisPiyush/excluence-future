import { getNFTTraits } from "../src/script/get_nft_trait"
import * as fcl from "@onflow/fcl"

fcl.config({
    "accessNode.api": process.env['NEXT_PUBLIC_FLOW_ACCESS_NODE'],
    "flow.network": process.env['NEXT_PUBLIC_FLOW_NETWORK'],
})


async function main() {
    const publicPath = 'MomentCollection'
    const address = '0x1f28ae193cae956b'
    const id = 24264026

    const traits = await getNFTTraits(
        address,
        publicPath,
        id
    ) 

    return traits;
}



main().then()