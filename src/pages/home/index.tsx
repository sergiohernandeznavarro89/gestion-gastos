import { FC, useEffect, useState } from 'react'
import { StyledDiv } from './styled';
import { useSelector } from 'react-redux';

interface Props {

}

const Home: FC<Props> = (props: Props) => {
    return (
        <>
            <StyledDiv>Home page</StyledDiv>
        </>
    )
}

export default Home