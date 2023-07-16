import {getQueue} from "../scanner/queue";

async function main() {
    const queue = getQueue();
    const jobCount = await queue.getJobCounts('wait', 'failed', "completed", "waiting", "waiting-children", "delayed")
    console.log(`Job count data: ${JSON.stringify(jobCount)}`)
}

main().then()