import { Button } from "@mui/material";
import * as fcl from "@onflow/fcl"

interface ConnectWalletButtonProps {}

export default function ConnectWalletButton(props: ConnectWalletButtonProps) {
    return <Button variant="outlined" 
                onClick={() => {
                    fcl.authenticate();
                }}
            >
                Connect Wallet
            </Button>
}