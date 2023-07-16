import { createBullBoard } from "@bull-board/api";
import {BullMQAdapter} from "@bull-board/api/bullMQAdapter";
import { HapiAdapter } from "@bull-board/hapi";

import { Queue } from "steward";

import * as Hapi from "@hapi/hapi";
import { getQueue } from "./scanner/queue";


export const runBullDashboard = async (queue?: Queue) => {
    queue = queue || getQueue();
    const app = Hapi.server({
        port: 9090,
        host: 'localhost'
    })

    const serverAdapter = new HapiAdapter();

    createBullBoard({
        queues: [new BullMQAdapter(queue)],
        serverAdapter
    });

    serverAdapter.setBasePath('/');
    await app.register(serverAdapter.registerPlugin());


    await app.start();
    console.log('Running on 9090:.....')
}

if (require.main === module) {
    runBullDashboard().then()
} 

