import { styled } from 'lib/stitches.config';
import { ModalDialog } from '@mui/joy';

export const StyledModalDialog = styled(ModalDialog, {
    width: '90%',

    '@tablet': {
        width: '50%'
    },

    '@desktop': {
        width: '30%'
    },
});