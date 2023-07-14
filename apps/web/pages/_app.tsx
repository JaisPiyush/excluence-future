import BaseLayout from '@/layouts/BaseLayout';
import '@/styles/globals.css'
import { darkTheme } from '@/styles/theme/darkTheme';
import createEmotionCache from '@/utility/createEmotionCache';
import { EmotionCache } from '@emotion/cache';
import { CacheProvider, ThemeProvider } from '@emotion/react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {  CssBaseline } from '@mui/material';
import * as fcl from "@onflow/fcl"

import type { AppProps } from 'next/app'

fcl.config({
  "accessNode.api": "https://mainnet.onflow.org",
  "flow.network": "mainnet",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "env": "mainnet",
  "app.detail.title": "Excluence",
});

const clientSideEmotionCache = createEmotionCache();

export default function App(props: AppProps  & {emotionCache: EmotionCache}) {
  const { Component, pageProps, emotionCache = clientSideEmotionCache } = props
  return  <CacheProvider value={emotionCache}>
              <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <BaseLayout>
                  <Component {...pageProps} />
                </BaseLayout>
              </ThemeProvider>   
          </CacheProvider>
}
