import { ClassConstructor } from "class-transformer";
import { AddListingJob } from "steward/src/jobs/AddListing.job";
import {ListingCompletedJob} from "steward/src/jobs/ListingCompleted.job";

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

const eventNameJobHandlerMap = new Map<string, ClassConstructor<unknown>>([
    ["ListingAvailable",  AddListingJob],
    ["ListingCompleted", ListingCompletedJob]

]);

export function getEventJobHandler(eventName: string) {
    const jobClass = eventNameJobHandlerMap.get(eventName);
    if (jobClass !== undefined) return jobClass;
    const splitted = eventName.split(".");
    const event = splitted[3];
    return eventNameJobHandlerMap.get(event);
}