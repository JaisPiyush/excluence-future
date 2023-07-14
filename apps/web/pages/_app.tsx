import '@/styles/globals.css'
import { darkTheme } from '@/styles/theme/darkTheme';
import createEmotionCache from '@/utility/createEmotionCache';
import { EmotionCache } from '@emotion/cache';
import { CacheProvider, ThemeProvider } from '@emotion/react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Box, CssBaseline } from '@mui/material';

import type { AppProps } from 'next/app'

const clientSideEmotionCache = createEmotionCache();

export default function App(props: AppProps  & {emotionCache: EmotionCache}) {
  const { Component, pageProps, emotionCache = clientSideEmotionCache } = props
  return  <CacheProvider value={emotionCache}>
              <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <Box bgcolor={'secondary.dark'}>
                  <Component {...pageProps} />
                </Box>
              </ThemeProvider>   
          </CacheProvider>
}
