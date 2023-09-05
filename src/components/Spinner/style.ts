import { styled } from 'lib/stitches.config';

export const SpinnerOverlay = styled('div', {
    position:'fixed',
    top: '0',
    left: '0',
    width:'100%',
    height:'100%',
    backgroundColor: 'rgb(0,0,0,0.5)',
    display: 'flex',
    justifyContent:'center',
    alignItems:'center',
    zIndex:'999'
});