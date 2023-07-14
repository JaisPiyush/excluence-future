import LoaderModal from "@/components/LoaderModal";
import SnackAlert from "@/components/SnackAlert";
import NavBar from "@/modules/NavBar";
import { useAppDispatch, useAppSelector } from "@/store";
import { globalActions } from "@/store/global";
import { Box } from "@mui/material";
import { ReactNode } from "react";

export default function BaseLayout(props: {children: ReactNode}) {
    const [loaderState, snackAlertState] = useAppSelector(state => [
        state.global.loaderState,
        state.global.snackAlertState
    ]);

    const dispatch = useAppDispatch()


    const handleOnCloseInLoader = () => {
        if (loaderState && loaderState.autoCloseOnClick !== false) {
            dispatch(globalActions.disableLoader());
        }
    }

    const handleOnCloseInSnackAlert = () => {
        if (snackAlertState && snackAlertState.autoCloseOnClick !== false) {
            dispatch(globalActions.disableSnackAlert());
        }
    }

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
                <LoaderModal 
                    open={loaderState !== undefined && loaderState.open}
                    loadingText={loaderState !== undefined? loaderState.loadingText : undefined}
                    onClose={handleOnCloseInLoader}
                />

                <SnackAlert 
                    severity={snackAlertState? snackAlertState.severity: undefined}
                    error={snackAlertState? snackAlertState.error : null}
                    onClose={handleOnCloseInSnackAlert}
                />

            </Box>
}