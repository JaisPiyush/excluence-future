import { SxProps, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ReactNode } from "react";

interface SectionHeadlinerProps {
    header: string;
    subheader?: ReactNode;
    headerSx?: SxProps;
    subheaderSx?: SxProps;
}


export default function SectionHeadliner(props: SectionHeadlinerProps) {
    return <Box sx={{flexGrow: 1, borderBottom: 1, borderColor: 'divider', paddingY: '1rem'}}>
                <Typography variant="h4" fontSize={'1.5rem'} fontWeight={500} sx={props.headerSx}>{props.header}</Typography>
                <Typography variant="body1" fontSize={'0.875rem'} color="secondary.light" sx={props.subheaderSx}>{props.subheader}</Typography>
            </Box>
}