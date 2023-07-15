import { PrismaClient } from "@prisma/client";
import { CreateStoreDto, CreateStoreWithEventsDto } from "./store.dto";
import { CreateStoreEventsDto } from "../storeEvents/storeEvents.dto";
import { StoreEventsService } from "../storeEvents/storeEvents.service";

export class StoreService {
    public readonly storeEventsService: StoreEventsService;
    constructor(public readonly prisma: PrismaClient) {
        this.storeEventsService = new StoreEventsService(prisma);
    }

    async create(args: CreateStoreDto) {
        return await this.prisma.store.create({
            data: args
        });
    }

    async createWithEvents(args: CreateStoreWithEventsDto) {
        const store = await this.create(args.store);
        const events: CreateStoreEventsDto[] = args.events.map((event) => {
            return {
                address: store.address,
                event
            }
        });

        return await this.storeEventsService.createMany(events);
    }

    async findAll() {
        return await this.prisma.store.findMany();
    }

    async findStoreByAddress(address: string) {
        return await this.prisma.store.findFirst({
            where: {
                address
            }
        })
    }

    async updateStoreStartHeightBlock(address: string, startBlockHeight: number) {
        return await this.prisma.store.update({
            where: {
                address
            },
            data: {
                startBlockHeight
            }
        })
    }

    async findAllStoreEvents() {
        return await this.prisma.store.findMany({
            include: {
                StoreEvents: {
                    select: {
                        address: true, 
                        event: true
                    }
                }
            }
        });
    }
}