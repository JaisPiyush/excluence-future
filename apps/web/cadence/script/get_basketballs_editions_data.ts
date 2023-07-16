import * as fcl from "@onflow/fcl";

export async function getBasketballsEditions() {
    const cadence = `
    import Basketballs from 0xeee6bdee2b2bdfc8

    pub fun main(): [Basketballs.Edition] {
        return Basketballs.getAllEditions()
    }
    `;

    return await fcl.query({
        cadence,
    });
}