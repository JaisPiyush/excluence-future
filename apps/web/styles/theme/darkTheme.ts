import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#E94560'
        },
        secondary: {
            dark: '#16213E',
            main: '#0F3460',
            light: '#533483'
        }
    },
    typography: {
        fontFamily: [
            'Roboto',
            'sans-serif'
        ].join(',')
    },
    components: {
        MuiUseMediaQuery: {
            defaultProps: {
                noSsr: true
            }
        }
    }
});