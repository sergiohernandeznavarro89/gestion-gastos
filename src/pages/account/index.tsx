import { FC, useEffect } from 'react'
import { Text, Card } from '@nextui-org/react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { useDispatch } from 'react-redux';
import * as MenuActions from "store/actions/MenuActions";

interface Props {

}

const Account: FC<Props> = (props: Props) => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(MenuActions.SetMenu({
            menuId: 1,
        }) as any);
    }, [])



    return (
        <>
            <h1>Pagina cuentas</h1>
        </>
    )
}

export default Account