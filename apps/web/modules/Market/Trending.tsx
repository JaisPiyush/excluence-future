import CollectionDataGrid from "@/components/CollectionDataGrid";
import SectionHeadliner from "@/components/SectionHeadliner";
import { MarketCollectionRow } from "@/utility/types";
import { Box } from "@mui/material";

interface TrendingProps {}

const rows: MarketCollectionRow[] = [];

export default function Trending(props: TrendingProps) {

    

    return <Box sx={{width: '100%', height: '100%', padding: '1rem'}}>
                <SectionHeadliner 
                    header="Trending Collections"
                    subheader={"Aggregated from multiple marketplaces"}
                />
                <CollectionDataGrid rows={rows}/>
            </Box>
}