import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as MenuActions from "store/actions/MenuActions";
import { ToastContainer, toast } from 'react-toastify';
import Spinner from 'components/Spinner';
import { Card, Text } from '@nextui-org/react';
import { TabView, TabPanel } from 'primereact/tabview';
import { PeriodTypeEnum } from 'enums/PeriodTypeEnum';
import _ from 'lodash';
import { TransferResponse } from 'models/transfer/TransferResponse';
import { GetAllTransfers } from 'services/transfer/TransferService';
import TransferRecurrentsList from 'components/TransferRecurrentsList';
import TransferSporadicList from 'components/TransferSporadicList';

interface TransfersGroupedByMonthYear {
    [key: string]: TransferResponse[];
}

interface Props {
    userId: number
}

const Transfer: FC<Props> = ({ userId }) => {
    const dispatch = useDispatch();
    const [refresh, setRefresh] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [itemsList, setItemsList] = useState<TransferResponse[]>([])
    const [transfersRecurrentList, setTransfersRecurrentList] = useState<TransferResponse[]>([])
    const [transfersSporadicList, setTransfersSporadicList] = useState<TransfersGroupedByMonthYear>()
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    useEffect(() => {
        dispatch(MenuActions.SetMenu({
            menuId: 6, // New menu id for transferencias
        }) as any);
    }, [])

    useEffect(() => {
        const recurrentes = itemsList.filter(x => x.periodTypeId === PeriodTypeEnum.Recurrente);
        setTransfersRecurrentList(recurrentes);
        
        const exporadicos = itemsList.filter(x => x.periodTypeId === PeriodTypeEnum.Exporadico);
        const sortedItems = exporadicos.sort((a, b) => {
            const dateA = new Date(a.startDate).getTime();
            const dateB = new Date(b.startDate).getTime();
            return dateB - dateA;
        });
        const groupedByMonthYear = _.groupBy(sortedItems, (item: any) => {
            const startDate = new Date(item.startDate);
            return `${startDate.getMonth() + 1}-${startDate.getFullYear()}`;
        });
        setTransfersSporadicList(groupedByMonthYear);
    }, [itemsList])
    
    useEffect(() => {
        if (userId) {
            setLoading(true);
            (async () => {
                const transfersResponse = await GetAllTransfers(userId);
                setItemsList(transfersResponse);                
                setLoading(false);
            })();
        }
    }, [userId, refresh]);

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

                <div className='flex flex-column m-2 gap-3'>
                    <Text h4 className='m-0' color='primary' >Recurrentes</Text>
                    <div className='flex gap-2 w-12'>
                        <div className='w-12 md:w-6 flex flex-column gap-2'>
                            <Card
                                className='p-2'
                                variant="bordered"
                            >
                                <TransferRecurrentsList
                                    itemsList={transfersRecurrentList}
                                    displayToast={displayToast}
                                />
                            </Card>
                        </div>
                    </div>
                </div>

                <div className='flex flex-column m-2 gap-3'>
                    <Text h4 className='m-0' color='primary' >Exporádicas</Text>
                    <div className='flex gap-2 w-12'>
                        <div className='w-12 md:w-6 flex flex-column gap-2'>
                            <Card
                                className='p-2'
                                variant="bordered"
                            >
                                {transfersSporadicList && <TransferSporadicList
                                    itemsList={transfersSporadicList}
                                    displayToast={displayToast}
                                />}
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Transfer
