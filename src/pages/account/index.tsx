import { Card } from '@nextui-org/react';
import AccountCard from 'components/AccountCard';
import { AccountResponse } from 'models/account/AccountResponse';
import { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { GetAccountsByUser } from 'services/account/AccountService';
import * as MenuActions from "store/actions/MenuActions";
import { Text } from '@nextui-org/react';
import Spinner from 'components/Spinner';
import { Button } from 'primereact/button';
import AddIcon from '@mui/icons-material/Add';
import { Dialog } from 'primereact/dialog';
import AccountForm from 'components/AccountForm';

interface Props {
    userId: number
}

const Account: FC<Props> = ({userId}) => {

    const dispatch = useDispatch();

    const [accounts, setAccounts] = useState<AccountResponse[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [showDialogNewAccount, setShowDialogNewAccount] = useState<boolean>(false);

    useEffect(() => {
        if (userId) {
            setLoading(true);
            (async () => {
                const [
                    accountsResponse                    
                ] = await Promise.all([
                    GetAccountsByUser(userId),
                ]);
                setAccounts(accountsResponse);                
                setLoading(false);
            })();
        }
    }, [userId, refresh]);

    useEffect(() => {
        dispatch(MenuActions.SetMenu({
            menuId: 1,
        }) as any);
    }, [])

    const displayToast = (message: string, severity: string) => {
        if (severity === 'success') {
            toast.success(message);
            setRefresh(!refresh);
        }
        else {
            toast.error(message);
        }
    }

    return (
        <div className='flex flex-column w-12' style={{marginTop:'80px'}}>
            <div className='flex flex-column w-12 p-2 gap-3'>
                {loading && <Spinner loading={loading}/>}
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

                <div className='flex flex-column gap-1'>
                    <div className='flex flex-row align-items-center gap-1'>
                        <Text h4 className='m-0' color='primary' >Cuentas</Text>
                        <Button icon={<AddIcon />} className='p-0 pt-1' style={{ height: 'fit-content' }} rounded text onClick={() => setShowDialogNewAccount(true)} />
                    </div>
                </div>

                <div className='flex flex-row flex-wrap'>
                    {accounts.length > 0 ? accounts.map((item) => (
                        <div className={`p-2 w-12 md:w-2`}>
                            <AccountCard
                                key={`account-${item.accountId}`}
                                displayToast={displayToast}
                                item={item}
                                fullWidth
                            />
                        </div>
                    )) : 
                        <Card
                            className='p-2 w-12'
                            variant="bordered"
                        >
                            <Text h5 className='m-0' >No existen cuentas que mostrar</Text>
                        </Card>
                    }
                </div>
            </div>
            
            <Dialog header="Nueva Cuenta" maximizable visible={showDialogNewAccount} style={{ width: '95%' }} onHide={() => setShowDialogNewAccount(false)}>
                <AccountForm cancelClick={() => setShowDialogNewAccount(false)} displayToast={displayToast} />
            </Dialog>
        </div>
    )
}

export default Account