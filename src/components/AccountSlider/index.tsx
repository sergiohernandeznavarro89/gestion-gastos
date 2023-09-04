import { FC, useState } from 'react';

import { AccountResponse } from 'models/account/AccountResponse';

import { Text } from '@nextui-org/react';

import Box from '@mui/joy/Box';
import { Card } from '@nextui-org/react';

import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { StyledModalDialog } from './styled';
import AddIcon from '@mui/icons-material/Add';
import Modal from '@mui/joy/Modal';
import { ModalClose } from '@mui/joy';

import { Button } from 'primereact/button';
import NewAccountForm from 'components/NewAccountForm';
import { ToastContainer, toast } from 'react-toastify';


interface Props {
    accounts: AccountResponse[];
    refresh: () => void;
};

const AccountSlider: FC<Props> = ({ accounts, refresh }) => {

    const [showDialogNewAccount, setShowDialogNewAccount] = useState<boolean>(false);

    const displayToast = (message: string, severity: string) => {
        if (severity === 'success') {
            toast.success(message);
            refresh();
        }
        else {
            toast.error(message);
        }
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

            <div className='flex flex-column m-2'>
                <div className='flex flex-column gap-1'>
                    <div className='flex flex-row align-items-center gap-1'>
                        <Text h4 className='m-0' color='primary' >Cuentas</Text>
                        <Button icon={<AddIcon />} className='p-0 pt-1' style={{ height: 'fit-content' }} rounded text onClick={() => setShowDialogNewAccount(true)} />
                    </div>
                </div>

                <div className='flex flex-row gap-2'>
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
                        {accounts.length > 0 ? accounts.map((item) => (
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
                                        <Button icon={<ArrowCircleDownIcon />} severity='success' rounded text raised />
                                        <Button icon={<ArrowCircleUpIcon />} severity='danger' rounded text raised />
                                    </div>
                                </Box>
                            </Card>
                        )) : <Card
                            className='p-2 w-12'
                            variant="bordered"
                        >
                            <Text h5 className='m-0' >No existen cuentas que mostrar</Text>
                        </Card>}
                    </Box>
                </div>
            </div>

            <Modal
                open={showDialogNewAccount}
                onClose={() => setShowDialogNewAccount(false)}
            >
                <StyledModalDialog
                    aria-labelledby="basic-modal-dialog-title"
                    aria-describedby="basic-modal-dialog-description"
                    variant='outlined'
                >
                    <div className='flex flex-column gap-3'>
                        <div className='flex flex-row justify-content-between'>
                            <ModalClose className="pt-2" />
                            <Text h4 color='primary'>Nueva Cuenta</Text>
                        </div>
                        <div>
                            <NewAccountForm cancelClick={() => setShowDialogNewAccount(false)} displayToast={displayToast} />
                        </div>
                    </div>
                </StyledModalDialog>
            </Modal>
        </>
    )
}

export default AccountSlider