import NavBar from "@/modules/NavBar";
import { Box } from "@mui/material";
import { ReactNode } from "react";

export default function BaseLayout(props: {children: ReactNode}) {
    return <Box bgcolor={'secondary.dark'} 
                sx={{
                    width: '100vw', 
                    height: '100vh',
                    overflowX: 'hidden',
                    maxHeight: 'auto',
                    overflowY: 'auto'
                }}
            >   
                <NavBar />
                {props.children}
            </Box>
}