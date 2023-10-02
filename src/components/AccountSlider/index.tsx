import { FC, useState } from 'react';

import { AccountResponse } from 'models/account/AccountResponse';

import { Text } from '@nextui-org/react';
import Box from '@mui/joy/Box';
import { Card } from '@nextui-org/react';
import AddIcon from '@mui/icons-material/Add';
import { Button } from 'primereact/button';
import { ToastContainer, toast } from 'react-toastify';
import { Dialog } from 'primereact/dialog';

import AccountForm from 'components/AccountForm';
import AccountCard from 'components/AccountCard';
import { classNames } from 'primereact/utils';


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
                        className='pl-1 pr-1'
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
                            <AccountCard
                                key={`account-${item.accountId}`}
                                displayToast={displayToast}
                                item={item}
                            />

                        )) : <Card
                            className='p-2 w-12'
                            variant="bordered"
                        >
                            <Text h5 className='m-0' >No existen cuentas que mostrar</Text>
                        </Card>}
                    </Box>
                </div>
            </div>

            <Dialog header="Nueva Cuenta" maximizable visible={showDialogNewAccount} style={{ width: '95%' }} onHide={() => setShowDialogNewAccount(false)}>
                <AccountForm cancelClick={() => setShowDialogNewAccount(false)} displayToast={displayToast} />
            </Dialog>
        </>
    )
}

export default AccountSlider