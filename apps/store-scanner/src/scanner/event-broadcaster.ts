import { EventBroadcasterInterface } from "flow-scanner-lib/lib/broadcaster/event-broadcaster";
import { FlowEvent } from "flow-scanner-lib/lib/flow/models/flow-event";
import { getEventJobHandler } from "./events";
import { Logger } from "logger";
import { getQueue } from "./queue";

export class QueueEventBroadcaster implements EventBroadcasterInterface {

    // constructor(private readonly collectionId: string) {}

    broadcastEvents =  async (blockHeight: number, events: FlowEvent[]) : Promise<void> => {
        Logger.info(`Indexed block: ${blockHeight}`);
        const queue = getQueue();
        for (const event of events) {
            const name = Date.now().toString();
            const jobClass = getEventJobHandler(event.type);
            if (jobClass) {
                await queue.add(name, new jobClass(event));
            }
        }
                       
    }
}