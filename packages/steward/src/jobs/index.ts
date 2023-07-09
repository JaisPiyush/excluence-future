import { plainToInstance } from 'class-transformer';
import { BaseJob, JobImp } from './job.definition';

export * from './job.definition';

export const JobDictionary: Map<string, typeof BaseJob> = new Map([]);

export const getJobInstance = (data: JobImp) => {
    const jobClass = JobDictionary.get(data.name);
    if (jobClass){
        return plainToInstance(jobClass, data)
    }
    return {} as JobImp;
}