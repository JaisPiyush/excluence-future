import { MarketCollectionRow } from "@/utility/types";
import { server } from "./server";

export async function getTrendingMarket() {
    const res =  await server.get<{data:MarketCollectionRow[]}>('/market');
    return res.data.data
}