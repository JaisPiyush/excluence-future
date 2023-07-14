import ConnectWalletButton from "@/components/ConnectWalletButton";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import {FaCartShopping} from "react-icons/fa6";

export default function NavBar() {
    return  <AppBar position="static">
                <Toolbar sx={{
                    bgcolor: 'secondary.main'
                }}>
                    <Typography>Excluence</Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <ConnectWalletButton />
                    <IconButton sx={{
                        marginX: '0.5rem',
                        marginLeft: '2rem'
                    }}>
                        <FaCartShopping />
                    </IconButton>
                </Toolbar>
            </AppBar>
}