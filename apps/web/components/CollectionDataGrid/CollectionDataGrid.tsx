import { MarketCollectionRow } from "@/utility/types"
import { Avatar, Box, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams, GridValueFormatterParams } from "@mui/x-data-grid"

interface CollectionDataGridProps {
    rows: MarketCollectionRow[]
}

const columns: GridColDef<MarketCollectionRow>[] = [
    {
        field: 'collection', 
        headerName: 'Collection', 
        minWidth: 150,
        flex: 1,
        maxWidth: 400,
        renderCell: (params: GridRenderCellParams<MarketCollectionRow>) => {
            return <Box sx={{display: 'flex'}}>
                <Avatar src={params.row.squareImage} />
                <Typography>{params.row.collectionName}</Typography>
            </Box>
        },
        disableColumnMenu: true
    
    },
    {
        field: 'avgSalePrice',
        headerName: 'Avg. Price',
        maxWidth: 300,
        minWidth: 200,
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
        flex: 1,
        disableColumnMenu: true
    },
    {
        field: 'sales',
        headerName: 'Sales',
        maxWidth: 300,
        minWidth: 200,
        flex: 1,
        disableColumnMenu: true
    }
];

export default function CollectionDataGrid(props: CollectionDataGridProps) {
    return <Box sx={{width: '100%', height: '60vh', maxHeight: '100%'}}>
        <DataGrid 
            rows={props.rows}
            columns={columns}
            disableRowSelectionOnClick
            
        />
    </Box>
}