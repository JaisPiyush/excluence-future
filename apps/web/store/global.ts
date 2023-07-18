import { LoaderModalProps } from "@/components/LoaderModal/LoaderModal"
import { SnackAlertProps } from "@/components/SnackAlert/SnackAlert";
import { AlertColor } from "@mui/material";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AutoCloseOnClickProps {
    autoCloseOnClick?: boolean;
}

interface GlobalState {
    loaderState?: Omit<LoaderModalProps, "onClose"> & AutoCloseOnClickProps;
    snackAlertState?: Omit<SnackAlertProps, "onClose"> & AutoCloseOnClickProps;
}

const initialState: GlobalState = {}

const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setLoaderState(state: GlobalState, action: PayloadAction<typeof initialState.loaderState>) {
            state.loaderState = action.payload;
        },
        updateLoadingText(state: GlobalState, action: PayloadAction<string | undefined>) {
            if (state.loaderState) {
                state.loaderState.loadingText = action.payload;
            }
        },
        disableLoader(state: GlobalState) {
            state.loaderState = undefined;
        },
        setSnackAlertState(state: GlobalState, action: PayloadAction<typeof initialState.snackAlertState>) {
            state.snackAlertState = action.payload;
        },
        updateSnackAlertSeverity(state: GlobalState, action: PayloadAction<AlertColor | undefined>) {
            if (state.snackAlertState) {
                state.snackAlertState.severity = action.payload;
            }
        },
        updateSnackAlertError(state, action: PayloadAction<string | null>) {
            if (state.snackAlertState) {
                state.snackAlertState.error = action.payload;
            }
        },
        disableSnackAlert(state) {
            state.snackAlertState = undefined;
        } 
    }
});

export const globalActions = globalSlice.actions;

export default globalSlice.reducer;