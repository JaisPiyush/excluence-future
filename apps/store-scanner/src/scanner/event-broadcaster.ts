import { EventBroadcasterInterface } from "@rayvin-flow/flow-scanner-lib/lib/broadcaster/event-broadcaster";
import { FlowEvent } from "@rayvin-flow/flow-scanner-lib/lib/flow/models/flow-event";
import { defaultQueue } from "steward";
import { getEventJobHandler } from "./events";

export class QueueEventBroadcaster implements EventBroadcasterInterface {
    broadcastEvents =  async (blockHeight: number, events: FlowEvent[]) : Promise<void> => {

        for (const event of events) {
            const name = Date.now().toString();
            const jobClass = getEventJobHandler(event.type);
            if (jobClass) {
                await defaultQueue.add(name, new jobClass(event));
            }
        }
                       
    }
}