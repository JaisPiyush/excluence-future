import { getTrendingMarket } from "@/api/get_trending_market";
import CollectionDataGrid from "@/components/CollectionDataGrid";
import SectionHeadliner from "@/components/SectionHeadliner";
import { MarketCollectionRow } from "@/utility/types";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";

import * as fcl from "@onflow/fcl"

interface TrendingProps {}



export default function Trending(props: TrendingProps) {

    const [rows, setRows] = useState<MarketCollectionRow[]>([]);

    useEffect(() => {
        getTrendingMarket().then((rs) => {
            setRows(rs)
        })


    }, [])

    return <Box sx={{width: '100%', height: '100%', padding: '1rem'}}>
                <SectionHeadliner 
                    header="Trending Collections"
                    subheader={"Aggregated from multiple marketplaces"}
                />
                <CollectionDataGrid rows={rows.filter((row) => row.volume > 0)}/>
            </Box>
}