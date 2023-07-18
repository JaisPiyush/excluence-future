import { MarketCollectionRow } from "@/utility/types"
import { Avatar, Box, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams, GridValueFormatterParams, GridValueGetterParams } from "@mui/x-data-grid"
import FlowIcon from "../FlowIcon";

interface CollectionDataGridProps {
    rows: MarketCollectionRow[]
}

const getChangeSign = (current: number, prev: number) => {
    if (current && prev && prev > 0) {
        const color = current > prev ? "green": "red";
        return <Typography color={color}>{(current - prev) / prev}</Typography>
    }
    return <></>
}

const columns: GridColDef<MarketCollectionRow>[] = [
    {
        field: 'id', 
        headerName: 'Collection', 
        minWidth: 150,
        flex: 1,
        maxWidth: 600,
        valueGetter: (params: GridValueGetterParams<MarketCollectionRow>) => {
            return params.row.collectionId
        },
        renderCell: (params: GridRenderCellParams<MarketCollectionRow>) => {
            return <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Avatar src={params.row.squareImage} sx={{marginRight: '0.5rem'}} />
                <Typography>{params.row.collectionName}</Typography>
            </Box>
        },
        disableColumnMenu: true
    
    },
    {
        field: 'avgprice',
        headerName: 'Avg. Price',
        maxWidth: 300,
        minWidth: 200,
        align: 'center',
        headerAlign: 'center',
        flex: 1,
        valueFormatter(params: GridValueFormatterParams<number>) {
            return params.value.toFixed(2)
        },
        disableColumnMenu: true
    },
    {
        field: 'volume',
        headerName: 'Volume',
        maxWidth: 300,
        minWidth: 200,
        align: 'center',
        headerAlign: 'center',
        flex: 1,
        disableColumnMenu: true,
        renderCell: (params: GridRenderCellParams<MarketCollectionRow>) => {

            return <>
                <Typography>{params.row.volume}<FlowIcon /> </Typography>
                {getChangeSign(params.row.volume, params.row.volume_chg)}
            </>
        }
    },
    {
        field: 'count',
        headerName: 'Sales',
        maxWidth: 300,
        minWidth: 200,
        flex: 1,
        disableColumnMenu: true,
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'listings',
        headerName: 'Listings',
        maxWidth: 300,
        minWidth: 200,
        flex: 1,
        disableColumnMenu: true,
        align: 'center',
        headerAlign: 'center',
    }
];

export default function CollectionDataGrid(props: CollectionDataGridProps) {
    return <Box sx={{width: '100%', height: '70vh', maxHeight: '100%'}}>
        <DataGrid 
            rows={props.rows}
            columns={columns}
            getRowId={(row) => row.collectionId}
            disableRowSelectionOnClick
            
        />
    </Box>
}