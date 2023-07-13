import { plainToInstance } from 'class-transformer';
import {  JobImp } from './job.definition';
import { AddListingJob } from './AddListing.job';

export * from './job.definition';

export const JobDictionary = new Map([
    [AddListingJob.name, AddListingJob]
]);

export const getJobInstance = (data: JobImp) => {
    const jobClass = JobDictionary.get(data.name);
    if (jobClass){
        return plainToInstance(jobClass, data)
    }
    return {} as JobImp;
}

export function getContractId(eventName: string) {
    const splitted = eventName.split(".");
    return splitted.slice(0, 3).join(".")
}

export function getContractNameOnly(eventName: string) {
    const splitted = eventName.split(".");
    return splitted[2];
}

export function getEventTypeOnly(eventName: string) {
    const splitted = eventName.split(".");
    return splitted[3];
}

export function getAddressOnly(eventName: string) {
    const splitted = eventName.split(".");
    return "0x"+ splitted[1];
}