import { Box, CircularProgress, Modal, Typography } from "@mui/material";

export interface LoaderModalProps {
    open: boolean;
    onClose: () => void;
    loadingText?: string
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

export default function LoaderModal(props: LoaderModalProps) {
    return <Modal
                open={props.open}
                onClose={props.onClose}
            >
                <Box sx={{
                    ...style,
                    width: 300,
                    height: 300,
                    bgcolor: 'secondary.main',
                    border: '0px',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <CircularProgress size={"4rem"} />
                    <Typography sx={{marginTop: '2rem'}} variant="body1" color="primary.light">{props.loadingText || 'Loading...'}</Typography>
                </Box>
        </Modal>
}