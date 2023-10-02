import { FC, useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import * as MenuActions from "store/actions/MenuActions";

import { ToastContainer, toast } from 'react-toastify';
import Spinner from 'components/Spinner';
import { Card, Text } from '@nextui-org/react';

import { TabView, TabPanel } from 'primereact/tabview';
import { GetAllItems } from 'services/item/ItemService';
import { ItemResponse } from 'models/item/ItemResponse';
import { ItemTypeEnum } from 'enums/ItemTypeEnum';
import { PeriodTypeEnum } from 'enums/PeriodTypeEnum';

import _ from 'lodash';
import PaymentsInvoicesRecurrentsList from 'components/PaymentsInvoicesRecurrentsList';
import PaymentsInvoicesSporadicList from 'components/PaymentsInvoicesSporadicList';

interface ItemsGroupedByMonthYear {
    [key: string]: ItemResponse[];
}
interface Props {
    userId: number
}

const PaymentsAndInvoices: FC<Props> = ({ userId }) => {

    const dispatch = useDispatch();
    const [refresh, setRefresh] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [itemsList, setItemsList] = useState<ItemResponse[]>([])
    const [itemsPaymentRecurrenteList, setItemsPaymentRecurrenteList] = useState<ItemResponse[]>([])
    const [itemsInvoiceRecurrenteList, setItemsInvoiceRecurrenteList] = useState<ItemResponse[]>([])
    const [itemsPaymentExporadicoList, setItemsPaymentExporadicoList] = useState<ItemsGroupedByMonthYear>()
    const [itemsInvoiceExporadicoList, setItemsInvoiceExporadicoList] = useState<ItemsGroupedByMonthYear>()
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    useEffect(() => {
        dispatch(MenuActions.SetMenu({
            menuId: 2,
        }) as any);
    }, [])

    useEffect(() => {
        if(itemsList.length>0){
            const paymentsRecurrentes = itemsList.filter(x => x.itemTypeId === ItemTypeEnum.Gasto && x.periodTypeId === PeriodTypeEnum.Recurrente);
            setItemsPaymentRecurrenteList(paymentsRecurrentes);
            
            const invoicesRecurrentes = itemsList.filter(x => x.itemTypeId === ItemTypeEnum.Ingreso && x.periodTypeId === PeriodTypeEnum.Recurrente);
            setItemsInvoiceRecurrenteList(invoicesRecurrentes);

            const paymentsExporadicos: ItemResponse[] = itemsList.filter(x => x.itemTypeId === ItemTypeEnum.Gasto && x.periodTypeId === PeriodTypeEnum.Exporadico);
            const paymentsSortedItems = paymentsExporadicos.sort((a, b) => {
                const dateA = new Date(a.startDate).getTime();
                const dateB = new Date(b.startDate).getTime();
                return dateB - dateA;
            });
            const paymentsGroupedByMonthYear = _.groupBy(paymentsSortedItems, (item: any) => {
                const startDate = new Date(item.startDate);
                return `${startDate.getMonth() + 1}-${startDate.getFullYear()}`;
            });
            setItemsPaymentExporadicoList(paymentsGroupedByMonthYear);
            
            const invoicesExporadicos = itemsList.filter(x => x.itemTypeId === ItemTypeEnum.Ingreso && x.periodTypeId === PeriodTypeEnum.Exporadico);
            const invoicesSortedItems = invoicesExporadicos.sort((a, b) => {
                const dateA = new Date(a.startDate).getTime();
                const dateB = new Date(b.startDate).getTime();
                return dateB - dateA;
            });
            const invoicesGroupedByMonthYear = _.groupBy(invoicesSortedItems, (item: any) => {
                const startDate = new Date(item.startDate);
                return `${startDate.getMonth() + 1}-${startDate.getFullYear()}`;
            });
            setItemsInvoiceExporadicoList(invoicesGroupedByMonthYear);
        }
    }, [itemsList])
    

    useEffect(() => {
        if (userId) {
            setLoading(true);
            (async () => {
                const [
                    itemsResponse
                ] = await Promise.all([
                    GetAllItems(userId)
                ]);
                
                setItemsList(itemsResponse);                
                
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
                    {isMobile ?
                        <TabView>
                            <TabPanel header="Pagos">
                                <PaymentsInvoicesRecurrentsList
                                    listType='payment'
                                    itemsList={itemsPaymentRecurrenteList}
                                    displayToast={displayToast}
                                    itemType={ItemTypeEnum.Gasto}
                                />
                            </TabPanel>
                            <TabPanel header="Ingresos">
                                <PaymentsInvoicesRecurrentsList
                                    listType='invoice'
                                    itemsList={itemsInvoiceRecurrenteList}
                                    displayToast={displayToast}
                                    itemType={ItemTypeEnum.Ingreso}
                                />
                            </TabPanel>
                        </TabView>                        
                    :
                        <div className='flex gap-2 w-12'>
                            <div className='w-6 flex flex-column gap-2'>
                                <Text h5 className='m-0' color='primary' >Pagos</Text>
                                <Card
                                    className='p-2'
                                    variant="bordered"
                                >
                                    <PaymentsInvoicesRecurrentsList
                                        listType='payment'
                                        itemsList={itemsPaymentRecurrenteList}
                                        displayToast={displayToast}
                                        itemType={ItemTypeEnum.Gasto}
                                    />
                                </Card>
                            </div>
                            <div className='w-6 flex flex-column gap-2'>
                                <Text h5 className='m-0' color='primary' >Ingresos</Text>
                                <Card
                                    className='p-2'
                                    variant="bordered"
                                >   
                                    <PaymentsInvoicesRecurrentsList
                                        listType='invoice'
                                        itemsList={itemsInvoiceRecurrenteList}
                                        displayToast={displayToast}
                                        itemType={ItemTypeEnum.Ingreso}
                                    />
                                </Card>
                            </div>
                        </div>
                    }
                </div>

                <div className='flex flex-column m-2 gap-3'>
                    <Text h4 className='m-0' color='primary' >Exporádicos</Text>
                    {isMobile ?
                        <TabView>
                            <TabPanel header="Pagos">
                                {itemsPaymentExporadicoList && <PaymentsInvoicesSporadicList
                                    listType='payment'
                                    itemsList={itemsPaymentExporadicoList}
                                />}
                            </TabPanel>
                            <TabPanel header="Ingresos">
                                {itemsInvoiceExporadicoList && <PaymentsInvoicesSporadicList
                                    listType='invoice'
                                    itemsList={itemsInvoiceExporadicoList}
                                />}
                            </TabPanel>
                        </TabView>                        
                        :
                        <div className='flex gap-2 w-12'>
                            <div className='w-6 flex flex-column gap-2'>
                                <Text h5 className='m-0' color='primary' >Pagos</Text>
                                <Card
                                    className='p-2'
                                    variant="bordered"
                                >
                                    {itemsPaymentExporadicoList && <PaymentsInvoicesSporadicList
                                        listType='payment'
                                        itemsList={itemsPaymentExporadicoList}
                                    />}
                                </Card>
                            </div>
                            <div className='w-6 flex flex-column gap-2'>
                                <Text h5 className='m-0' color='primary' >Ingresos</Text>
                                <Card
                                    className='p-2'
                                    variant="bordered"
                                >
                                    {itemsInvoiceExporadicoList && <PaymentsInvoicesSporadicList
                                        listType='invoice'
                                        itemsList={itemsInvoiceExporadicoList}
                                    />}
                                </Card>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default PaymentsAndInvoices