import SectionHeadliner from "@/components/SectionHeadliner";
import { Box } from "@mui/material";

interface TrendingProps {}

export default function Trending(props: TrendingProps) {
    return <Box sx={{width: '100%', height: '100%', padding: '1rem'}}>
                <SectionHeadliner 
                    header="Trending Collections"
                    subheader={"Aggregated from multiple marketplaces"}
                />
            </Box>
}