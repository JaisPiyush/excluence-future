import { ClassConstructor, plainToInstance } from 'class-transformer';
import {  BaseJob, JobImp } from './job.definition';
import { AddListingJob } from './AddListing.job';
import { ListingCompletedJob } from './ListingCompleted.job';

export * from './job.definition';


export const JobDictionary = new Map<string, ClassConstructor<BaseJob>>([
    [AddListingJob.name, AddListingJob],
    [ListingCompletedJob.name, ListingCompletedJob]
]);

export const getJobInstance = (data: JobImp) => {
    const jobClass = JobDictionary.get(data.name);
    if (jobClass){
        return plainToInstance(jobClass, data)
    }
    return {} as JobImp;
}
