import { styled } from 'lib/stitches.config';
import { ModalDialog } from '@mui/joy';
import { Button } from 'primereact/button';

export const StyledModalDialog = styled(ModalDialog, {
    width: '90%',

    '@tablet': {
        width: '50%'
    },

    '@desktop': {
        width: '30%'
    },
});

export const ButtonTag = styled(Button, {
    background: 'white !important',
    color:'black !important',
    height:'40px'
});