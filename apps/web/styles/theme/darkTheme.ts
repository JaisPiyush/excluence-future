import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#E94560'
        },
        secondary: {
            dark: '#151417',
            main: '#22262E',
            light: '#767F90'
        }
    },
    typography: {
        fontFamily: [
            'Poppins',
            'sans-serif'
        ].join(',')
    },
    components: {
        MuiUseMediaQuery: {
            defaultProps: {
                noSsr: true
            }
        },
        MuiButton: {
            defaultProps: {
                sx: {
                    textTransform: 'unset !important',
                }
            }
        },
        MuiTab: {
            defaultProps: {
                sx: {
                    textTransform: 'unset !important',
                }
            }
        },
    }
});