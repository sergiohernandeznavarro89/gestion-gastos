import { styled } from 'lib/stitches.config';
import { Button } from 'primereact/button';

export const ButtonTag = styled(Button, {
    background: 'white !important',
    color:'black !important',
    height:'40px'
});

export const ButtonTagSelected = styled(Button, {
    background: 'var(--blue-100) !important',
    color:'black !important',
    height:'40px'
});