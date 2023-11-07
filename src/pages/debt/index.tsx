import { FC, useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import * as MenuActions from "store/actions/MenuActions";

import { ToastContainer, toast } from 'react-toastify';
import { Text, Card } from '@nextui-org/react';
import Spinner from 'components/Spinner';
import { Button } from 'primereact/button';
import { GetAllDebts } from 'services/debt/debtService';
import { DebtResponse } from 'models/debt/DebtResponse';
import AddIcon from '@mui/icons-material/Add';
import DebtCard from 'components/DebtCard';
import { Dialog } from 'primereact/dialog';
import DebtForm from 'components/DebtForm';
import { GetAccountsByUser } from 'services/account/AccountService';
import { AccountResponse } from 'models/account/AccountResponse';
import { TabPanel, TabView } from 'primereact/tabview';


interface Props {
    userId: number
}

const Debt: FC<Props> = ({ userId }) => {

    const dispatch = useDispatch();

    const [refresh, setRefresh] = useState<boolean>(false);    
    const [loading, setLoading] = useState<boolean>(false);
    const [debtList, setDebtList] = useState<DebtResponse[]>([]);
    const [pendingDebtList, setPendingDebtList] = useState<DebtResponse[]>([]);
    const [completedDebtList, setCompletedDebtList] = useState<DebtResponse[]>([]);
    const [accountList, setAccountList] = useState<AccountResponse[]>([]);
    const isMobile = window.matchMedia('(max-width: 768px)').matches;    
    const [showDialogDebt, setShowDialogDebt] = useState<boolean>(false);

    useEffect(() => {
        dispatch(MenuActions.SetMenu({
            menuId: 4,
        }) as any);
    }, [])

    useEffect(() => {
        if (userId) {
            setLoading(true);
            (async () => {
                const [
                    accountsResponse,
                    debtsResponse
                ] = await Promise.all([
                    GetAccountsByUser(userId),
                    GetAllDebts(userId)                    
                ]);

                setAccountList(accountsResponse);
                setDebtList(debtsResponse);                

                setLoading(false);
            })();
        }
    }, [userId, refresh]);

    useEffect(() => {
      if(debtList.length > 0){
        const pendingDebts = debtList.filter(x => x.currentAmount > 0);
        const completedDebts = debtList.filter(x => x.currentAmount === 0);

        setCompletedDebtList(completedDebts);
        setPendingDebtList(pendingDebts);
      }          
    }, [debtList])
    

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
        <>
            {loading && <Spinner loading={loading}/>}

            <div className='flex flex-column w-12' style={{marginTop:'80px'}}>
                <div className='flex flex-column w-12 p-2 gap-3'>
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
                            <Text h4 className='m-0' color='primary' >Deudas</Text>
                            <Button icon={<AddIcon />} className='p-0 pt-1' style={{ height: 'fit-content' }} rounded text onClick={() => setShowDialogDebt(true)} />
                        </div>
                    </div>
                    
                        {debtList.length > 0 ? 
                            <TabView>
                                <TabPanel header="Pendientes">
                                    <div className='flex w-12 formgrid grid'>
                                        {pendingDebtList.map(x => 
                                            <DebtCard
                                                key={`debt-${x.debtId}`}
                                                debt={x}
                                                accountList = {accountList}
                                                displayToast={displayToast}
                                            />
                                        )}
                                    </div>
                                </TabPanel>
                                <TabPanel header="Completadas">
                                    <div className='flex w-12 formgrid grid'>
                                        {completedDebtList.map(x => 
                                            <DebtCard
                                                key={`debt-${x.debtId}`}
                                                debt={x}
                                                accountList = {accountList}
                                                displayToast={displayToast}
                                            />
                                        )}
                                    </div>
                                </TabPanel>
                            </TabView>                           
                        : 
                            <Card
                                style={{boxShadow: "rgba(0, 0, 0, 0.12) 0px 0px 4px 2px"}}
                                className='p-2'
                                variant="bordered"
                            >
                                No existen deudas que mostrar
                            </Card>
                        }
                </div>                    
            </div>    

            <Dialog 
                position="center" 
                style={ isMobile ? { width: '95%' } : {width:'50%'}} 
                header={'Nueva Deuda'} 
                maximizable 
                visible={showDialogDebt} 
                onHide={() => setShowDialogDebt(false)}
            >
                <DebtForm
                    cancelClick={() => setShowDialogDebt(false)}
                    displayToast={displayToast}                    
                />
            </Dialog>                
        </>
    )
}

export default Debt