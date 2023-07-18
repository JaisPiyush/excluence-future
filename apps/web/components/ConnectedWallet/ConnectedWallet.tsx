import { useAppDispatch } from "@/store";
import { globalActions } from "@/store/global";
import { suspenseWrapper } from "@/utility/suspenseWrapper";
import { FlowAccount, FlowUser, SuspenseWrapperResponse } from "@/utility/types";
import { Button, ButtonGroup, Skeleton } from "@mui/material";
import {FiCopy} from "react-icons/fi";
import * as fcl from "@onflow/fcl";
import { Suspense } from "react";
import { getNormalizedTokenAmount } from "@/utility/flowUtils";
import Image from "next/image";
import FlowIcon from "../FlowIcon";

interface ConnectedWalletProps {
    user: FlowUser;
}

export default function ConnectedWallet(props: ConnectedWalletProps) {
    
    const dispatch = useAppDispatch();
    
    const handleOnCopyClick = (_: any) => {
        navigator.clipboard.writeText(props.user.addr as string);
        dispatch(globalActions.setSnackAlertState({
            severity: "info",
            error: `Address: ${props.user.addr} copied`
        }))
    }

    const suspendedAccount = suspenseWrapper<FlowAccount>(fcl.account(props.user.addr as string));


    return <ButtonGroup variant="outlined">
        <Button>
            <Suspense fallback={<Skeleton width={'4rem'} />}>
                <UserBalanceButton account={suspendedAccount} />
            </Suspense>
        </Button>
        <Button>{props.user.addr}</Button>
        <Button onClick={handleOnCopyClick}>
            <FiCopy />
        </Button>
    </ButtonGroup>
}

export function UserBalanceButton(props: {account: SuspenseWrapperResponse<FlowAccount>}) {
    const account = props.account.read();

    return <>{getNormalizedTokenAmount(account.balance)}
                <FlowIcon />
    </>
}