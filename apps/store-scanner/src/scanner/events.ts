interface StoreEventData {
    address: string;
    event: string;
}

export const events: StoreEventData[] = [
    {
        address: "A.4eb8a10cb9f87357.NFTStorefrontV2",
        event: "ListingAvailable"
    },
    {
        address: "A.4eb8a10cb9f87357.NFTStorefrontV2",
        event: "ListingCompleted"
    }
]

export const getEvents = () => {
    return events.map((event) => `${event.address}.${event.event}`)
}