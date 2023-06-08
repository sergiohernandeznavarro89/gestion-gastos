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

const Home: FC<Props> = (props: Props) => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(MenuActions.SetMenu({
            menuId: 0,
        }) as any);
    }, [])


    const mock = [
        {
            "accountId": 2,
            "accountName": "BBVA",
            "userId": 2,
            "ammount": 1000
        },
        {
            "accountId": 2,
            "accountName": "Cajamar",
            "userId": 2,
            "ammount": -2000
        },
        {
            "accountId": 2,
            "accountName": "Sabadell",
            "userId": 2,
            "ammount": 3000
        },
    ];

    const data = [
        {
            src: 'https://images.unsplash.com/photo-1502657877623-f66bf489d236',
            title: 'Night view',
            description: '4.21M views',
        },
        {
            src: 'https://images.unsplash.com/photo-1527549993586-dff825b37782',
            title: 'Lake view',
            description: '4.74M views',
        },
        {
            src: 'https://images.unsplash.com/photo-1532614338840-ab30cf10ed36',
            title: 'Mountain view',
            description: '3.98M views',
        },
    ];

    return (
        <>
            <div className='flex flex-column gap-2 w-12'>
                <div className='flex flex-row gap-2 m-2'>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1,
                            py: 1,
                            overflow: 'auto',
                            width: '100%',
                            scrollSnapType: 'x mandatory',
                            '& > *': {
                                scrollSnapAlign: 'center',
                            },
                            '::-webkit-scrollbar': { display: 'none' },
                        }}
                    >
                        {mock.map((item) => (
                            <Card
                                className='p-2'
                                style={{ minWidth: '130px', maxWidth: '200px' }}
                                key={item.accountName}
                                variant="bordered"
                            >
                                <Box sx={{ whiteSpace: 'nowrap' }}>
                                    <Text h4 color='primary' >{item.accountName}</Text>
                                    <Text h5 color={item.ammount > 0 ? 'green' : 'red'}>{item.ammount} €</Text>
                                    <div className='flex flex-row justify-content-between'>
                                        <Button aria-label="ingreso" size='sm' variant="outlined" color="success">
                                            <ArrowCircleDownIcon />
                                        </Button>
                                        <Button aria-label="pago" size='sm' variant="outlined" color="danger">
                                            <ArrowCircleUpIcon />
                                        </Button>
                                    </div>
                                </Box>
                            </Card>
                        ))}
                    </Box>
                </div>
            </div>
        </>
    )
}

export default Home