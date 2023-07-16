import { getBasketballsEditions } from '@/cadence/script/get_basketballs_editions_data'
import { getCollectionData } from '@/cadence/script/get_collection_view'
import Market from '@/modules/Market'
import { Box, Tab, Tabs } from '@mui/material'
import Head from 'next/head'
import { useState } from 'react'


export default function Home() {

  const [tabIndex, setTabIndex] = useState(0)

  getBasketballsEditions().then((rs) => {
    console.log(rs)
  })

  return (
    <>
      <Head>
        <title>Excluence</title>
        <meta name="description" content="Excluence is an NFT Marketplace aggregator on Flow network" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box sx={{
        width: '100%', 
        bgcolor: 'secondary.main',
        paddingX: '2rem'
      }}>
        <Tabs value={tabIndex}>
          <Tab label="Trending" />
          <Tab label="Owned" />
        </Tabs>
      </Box>

      <Box>
        <Market tabIndex={tabIndex} />
      </Box>
      
    </>
  )
}
