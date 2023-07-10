import { Job } from "bullmq";
import { JobImp, BaseJob } from "./job.definition";

interface AddListingJobData {
    storeFrontAddress: string;
}

export class AddListingJob extends BaseJob implements JobImp {
    constructor(public payload: Record<string, unknown>) {
        super();
    }

    handle = async (job?: Job<any, any, string> | undefined) => {
        
    }

}