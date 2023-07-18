import GET_COLLECTION_VIEW from "./get_collection_view.cdc";
import * as fcl from "@onflow/fcl";

export async function getCollectionData(collectionId: string) {
    const [_, address, contractName] = collectionId.split(".");

    console.log("0x" + address, contractName);

    const result = await fcl.query({
        cadence: GET_COLLECTION_VIEW,
        args: (arg, t) => [
            arg("0x" + address, t.Address),
            arg(contractName, t.String)
        ]
    });

    return result;

}
