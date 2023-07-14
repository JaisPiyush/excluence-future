import { LoaderModalProps } from "@/components/LoaderModal/LoaderModal"
import { SnackAlertProps } from "@/components/SnackAlert/SnackAlert";
import { createSlice } from "@reduxjs/toolkit";

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
    reducers: {}
});

export const globalActions = globalSlice.actions;

export default globalSlice.reducer;