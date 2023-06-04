import { Card } from '@nextui-org/react';
import { styled } from 'lib/stitches.config';

export const LoginBackground = styled('div', {
    height: '100vh',
    backgroundColor: '$backgroundGray',
    width: '100%'
});

export const LoginCard = styled(Card, {

    width: '80%',

    '@tablet': {
        width: '70%'
    },

    '@desktop': {
        width: '40%'
    }
});

export const ValidationSpan = styled('span', {
    color: '$error'
})