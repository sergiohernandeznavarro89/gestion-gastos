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
import { AmmountTypeEnum } from 'enums/AmmountTypeEnum';
import { PeriodTypeEnum } from 'enums/PeriodTypeEnum';
import { ScrollPanel } from 'primereact/scrollpanel';

import _ from 'lodash';

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
    const [itemsPaymentExporadicoList, setItemsPaymentExporadicoList] = useState<any>()
    const [itemsInvoiceExporadicoList, setItemsInvoiceExporadicoList] = useState<any>()
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
            const paymentsSortedItems = paymentsExporadicos.sort((a: any , b: any) => b.startDate - a.startDate);
            const paymentsGroupedByMonthYear = _.groupBy(paymentsSortedItems, (item: any) => {
                const startDate = new Date(item.startDate);
                return `${startDate.getMonth() + 1}-${startDate.getFullYear()}`;
            });
            setItemsPaymentExporadicoList(paymentsGroupedByMonthYear);
            
            const invoicesExporadicos = itemsList.filter(x => x.itemTypeId === ItemTypeEnum.Ingreso && x.periodTypeId === PeriodTypeEnum.Exporadico);
            const invoicesSortedItems = invoicesExporadicos.sort((a: any , b: any) => b.startDate - a.startDate);
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

    const getPaymentsRecurrentes = () => {
        return <div style={{height:'100%', overflow:'hidden'}}>
            <ScrollPanel style={{ width: '100%', height: `${isMobile ? '200px' : '400px'}` }}>
                <div className='flex flex-column gap-2'>
                    {itemsPaymentRecurrenteList.length > 0 ? 
                        itemsPaymentRecurrenteList.map(x => <>
                            <Card
                                className='p-2'
                                key={x.itemId}
                                variant="bordered"
                            >
                                <div className='flex justify-content-between'>                                                
                                    <Text h5 className='m-0' color='primary' >{x.itemName}</Text>                                                
                                    <Text h5 className='m-0' color='primary' >{`${new Date(x.startDate).getDate()}-${new Date(x.startDate).getMonth() + 1}-${new Date(x.startDate).getFullYear()}`}</Text>
                                </div>
                                <div className='flex gap-2 justify-content-between align-items-center'>
                                    <div className='flex flex-column'>                                                            
                                        <Text h6 className='m-0' >{x.itemDesc}</Text>                                                    
                                        <Text h5 className='mt-2' color='red'>{x.ammountTypeId !== AmmountTypeEnum.Variable ? `${x.ammount} €` : 'Pago Variable'}</Text>
                                    </div>                                                
                                </div>
                            </Card>
                        </>)
                    : 
                        <Card
                            className='p-2'
                            variant="bordered"
                        >
                            No existen Pagos que mostrar
                        </Card>
                    }
                </div>
            </ScrollPanel>
        </div>
    };

    const getInvoicesRecurrentes = () => {
        return <div style={{height:'100%', overflow:'hidden'}}>
            <ScrollPanel style={{ width: '100%', height: `${isMobile ? '200px' : '400px'}` }}>
                <div className='flex flex-column gap-2'>
                    {itemsInvoiceRecurrenteList.length > 0 ? 
                        itemsInvoiceRecurrenteList.map(x =>                                         
                            <Card
                                className='p-2'
                                key={x.itemId}
                                variant="bordered"
                            >
                                <div className='flex justify-content-between'>                                                
                                    <Text h5 className='m-0' color='primary' >{x.itemName}</Text>                                                
                                    <Text h5 className='m-0' color='primary' >{`${new Date(x.startDate).getDate()}-${new Date(x.startDate).getMonth() + 1}-${new Date(x.startDate).getFullYear()}`}</Text>
                                </div>
                                <div className='flex gap-2 justify-content-between align-items-center'>
                                    <div className='flex flex-column'>                                                            
                                        <Text h6 className='m-0' >{x.itemDesc}</Text>                                                    
                                        <Text h5 className='mt-2' color='green'>{x.ammountTypeId !== AmmountTypeEnum.Variable ? `${x.ammount} €` : 'Ingreso Variable'}</Text>
                                    </div>
                                </div>
                            </Card>
                        )
                        : 
                        <Card
                            className='p-2'
                            variant="bordered"
                        >
                            No existen Ingresos que mostrar
                        </Card>
                    }
                </div>
            </ScrollPanel>
        </div>
    }

    const getPaymentsExporadicos = () => {
        return <div style={{height:'100%', overflow:'hidden'}}>
            <ScrollPanel style={{ width: '100%', height: `${isMobile ? '200px' : '400px'}` }}>
                <div className='flex flex-column gap-2'>
                    {itemsPaymentExporadicoList && Object.keys(itemsPaymentExporadicoList)?.length > 0 ? Object.keys(itemsPaymentExporadicoList).map((monthKey) => (
                        <div className='flex flex-column gap-2' key={monthKey}>
                            <Text h5 className='m-0' color='primary' >{monthKey}</Text>                                                                                                  
                            {itemsPaymentExporadicoList[monthKey].map((item: any, index: any) => (
                                <Card
                                    className='p-2'
                                    key={item.itemId}
                                    variant="bordered"
                                >
                                    <div className='flex justify-content-between'>                                                
                                        <Text h5 className='m-0' color='primary' >{item.itemName}</Text>                                                
                                        <Text h5 className='m-0' color='primary' >{`${new Date(item.startDate).getDate()}-${new Date(item.startDate).getMonth() + 1}-${new Date(item.startDate).getFullYear()}`}</Text>
                                    </div>
                                    <div className='flex gap-2 justify-content-between align-items-center'>
                                        <div className='flex flex-column'>                                                            
                                            <Text h6 className='m-0' >{item.itemDesc}</Text>                                                    
                                            <Text h5 className='mt-2' color='red'>{item.ammountTypeId !== AmmountTypeEnum.Variable ? `${item.ammount} €` : 'Pago Variable'}</Text>
                                        </div>                                                
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ))
                    :
                    <Card
                        className='p-2'
                        variant="bordered"
                    >
                        No existen Pagos que mostrar
                    </Card>
                    }                                            
                </div>
            </ScrollPanel>
        </div>
    }

    const getInvoicesExporadicos = () => {
        return <div style={{height:'100%', overflow:'hidden'}}>
            <ScrollPanel style={{ width: '100%', height: `${isMobile ? '200px' : '400px'}` }}>
                <div className='flex flex-column gap-2'>
                    {itemsInvoiceExporadicoList && Object.keys(itemsInvoiceExporadicoList).length > 0 ? Object.keys(itemsInvoiceExporadicoList).map((monthKey) => (
                        <div className='flex flex-column gap-2' key={monthKey}>
                            <Text h5 className='m-0' color='primary' >{monthKey}</Text>                                                                                                  
                            {itemsInvoiceExporadicoList[monthKey].map((item: any, index: any) => (
                                <Card
                                    className='p-2'
                                    key={item.itemId}
                                    variant="bordered"
                                >
                                    <div className='flex justify-content-between'>                                                
                                        <Text h5 className='m-0' color='primary' >{item.itemName}</Text>                                                
                                        <Text h5 className='m-0' color='primary' >{`${new Date(item.startDate).getDate()}-${new Date(item.startDate).getMonth() + 1}-${new Date(item.startDate).getFullYear()}`}</Text>
                                    </div>
                                    <div className='flex gap-2 justify-content-between align-items-center'>
                                        <div className='flex flex-column'>                                                            
                                            <Text h6 className='m-0' >{item.itemDesc}</Text>                                                    
                                            <Text h5 className='mt-2' color='green'>{item.ammountTypeId !== AmmountTypeEnum.Variable ? `${item.ammount} €` : 'Pago Variable'}</Text>
                                        </div>                                                
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ))
                    :
                    <Card
                        className='p-2'
                        variant="bordered"
                    >
                        No existen Ingresos que mostrar
                    </Card>
                    }
                </div>
            </ScrollPanel>
        </div>
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
                    <Text h4 className='m-0' color='primary' >Pagos recurrentes / Ingresos recurrentes</Text>
                    {isMobile ?
                        <TabView>
                            <TabPanel header="Pagos">
                                {getPaymentsRecurrentes()}
                            </TabPanel>
                            <TabPanel header="Ingresos">
                                {getInvoicesRecurrentes()}
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
                                    {getPaymentsRecurrentes()}
                                </Card>
                            </div>
                            <div className='w-6 flex flex-column gap-2'>
                                <Text h5 className='m-0' color='primary' >Ingresos</Text>
                                <Card
                                    className='p-2'
                                    variant="bordered"
                                >   
                                    {getInvoicesRecurrentes()}
                                </Card>
                            </div>
                        </div>
                    }
                </div>

                <div className='flex flex-column m-2 gap-3'>
                    <Text h4 className='m-0' color='primary' >Pagos exporádicos / Ingresos exporádicos</Text>
                    {isMobile ?
                        <TabView>
                            <TabPanel header="Pagos">
                                {getPaymentsExporadicos()}
                            </TabPanel>
                            <TabPanel header="Ingresos">
                                {getInvoicesExporadicos()}
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
                                    {getPaymentsExporadicos()}                            
                                </Card>
                            </div>
                            <div className='w-6 flex flex-column gap-2'>
                                <Text h5 className='m-0' color='primary' >Ingresos</Text>
                                <Card
                                    className='p-2'
                                    variant="bordered"
                                >
                                    {getInvoicesExporadicos()}
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