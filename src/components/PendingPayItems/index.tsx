import { FC, useEffect, useState } from 'react';

import { Text, Card } from '@nextui-org/react';

import { ToastContainer, toast } from 'react-toastify';
import { PendingPayItemsResponse } from 'models/item/PendingPayItemResponse';

import { Button } from 'primereact/button';
import { ScrollPanel } from 'primereact/scrollpanel';
import { TabView, TabPanel } from 'primereact/tabview';

import { AddItemPayment } from 'services/itemPayment/ItemPaymentService';
import { InputNumber } from 'primereact/inputnumber';
import { AmmountTypeEnum } from 'enums/AmmountTypeEnum';
import { ItemPaymentResponse } from '../../models/itemPayment/ItemPaymentResponse';
import { ItemTypeEnum } from 'enums/ItemTypeEnum';
import ArrowDownIcon from '@mui/icons-material/ArrowCircleDownOutlined';
import ArrowUpIcon from '@mui/icons-material/ArrowCircleUpOutlined';

interface Props {    
    refresh: () => void;
    pendingPayItems: PendingPayItemsResponse[];
    pendingPayItemsNextMonth: PendingPayItemsResponse[];
};

const PendingPayItems: FC<Props> = ({ refresh, pendingPayItems, pendingPayItemsNextMonth }) => {    

    const [pendingPayItemsAux, setPendingPayItemsAux] = useState<PendingPayItemsResponse[]>([]);

    useEffect(() => {
        if(pendingPayItems)
            setPendingPayItemsAux(pendingPayItems)      
    }, [pendingPayItems])
    

    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    const displayToast = (message: string, severity: string) => {
        if (severity === 'success') {
            toast.success(message);
            refresh();
        }
        else {
            toast.error(message);
        }
    }

    const payButtonClick = async (itemId: number) => {                
        const item = pendingPayItemsAux.find(x => x.itemId === itemId);
        if(item){
            var response = await AddItemPayment(itemId, item.ammount);
            
            if(response.success){
                displayToast("Pago efectuado correctamente", 'success');
                refresh();
            }
            else{
                displayToast("Error al efectuar el pago", 'error');
            }        
        }
    }

    const changeAmmount = (ammount: number | null, itemId: number) => {
        const newPendingPayItems = pendingPayItems.map(x => {
            if(x.itemId === itemId){
                return {...x, ...{ammount: ammount ? ammount : 0}}
            }
            return x;
        })

        setPendingPayItemsAux(newPendingPayItems);
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
                <div className='flex flex-column gap-3'>
                    <div className='flex flex-row align-items-center gap-1'>
                        <Text h4 className='m-0' color='primary' >Gastos/Ingresos Pendientes</Text>
                    </div>
                    {isMobile ?
                        <TabView>
                            <TabPanel header="Este Mes">
                                <div style={{height:'100%', overflow:'hidden'}}>
                                    <ScrollPanel style={{ width: '100%', height: '400px' }}>
                                        <div className='flex flex-column gap-2'>
                                            {pendingPayItemsAux.map(x => (                                                
                                                <Card
                                                    className='p-2'
                                                    key={x.itemId}
                                                    variant="bordered"
                                                >
                                                    <div className='flex justify-content-between'>
                                                        <div className='flex gap-2 w-9'>
                                                            {x.itemTypeId === ItemTypeEnum.Gasto ? <ArrowDownIcon style={{color:'red'}}/> : <ArrowUpIcon style={{color:'green'}}/>}
                                                            <Text h5 className='m-0' color='primary' >{x.itemName}</Text>
                                                        </div>
                                                        <Text h5 className='m-0' color='primary' >{`${new Date(x.startDate).getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`}</Text>
                                                    </div>
                                                    <div className='flex gap-2 justify-content-between align-items-center'>
                                                        <div className='flex flex-column'>                                                            
                                                            <Text h6 className='m-0' >{x.itemDesc}</Text>
                                                            {x.ammountTypeId !== AmmountTypeEnum.Variable ? 
                                                                <Text h5 className='mt-2' color={x.itemTypeId === ItemTypeEnum.Gasto ? 'red' : 'green'}>{x.ammount} €</Text>
                                                                : <InputNumber suffix=' €' className='p-inputtext-sm' value={x.ammount} onChange={(e) => changeAmmount(e.value, x.itemId)}/>
                                                            }

                                                        </div>
                                                        <div className='flex' style={{height:'fit-content'}}>
                                                            <Button label={x.itemTypeId === ItemTypeEnum.Gasto ? "Pagar" : "Cobrar"} rounded onClick={() => payButtonClick(x.itemId)}/>
                                                        </div>
                                                    </div>
                                                </Card>                            
                                            ))}                        
                                        </div>
                                    </ScrollPanel>
                                </div>
                            </TabPanel>
                            <TabPanel header="Proximo Mes">
                                <div style={{height:'100%', overflow:'hidden'}}>
                                <ScrollPanel style={{ width: '100%', height: '400px' }}>
                                        <div className='flex flex-column gap-2'>
                                            {pendingPayItemsNextMonth.map(x => (
                                                <Card
                                                    className='p-2'
                                                    key={x.itemId}
                                                    variant="bordered"
                                                >
                                                     <div className='flex justify-content-between'>
                                                     <div className='flex gap-2'>
                                                            {x.itemTypeId === ItemTypeEnum.Gasto ? <ArrowDownIcon style={{color:'red'}}/> : <ArrowUpIcon style={{color:'green'}}/>}
                                                            <Text h5 className='m-0' color='primary' >{x.itemName}</Text>
                                                        </div>                                                        <Text h5 className='m-0' color='primary' >{`${new Date(x.startDate).getDate()}-${new Date().getMonth() + 2}-${new Date().getFullYear()}`}</Text>
                                                    </div>
                                                    <div className='flex gap-2 justify-content-center align-items-center'>
                                                        <div className='flex flex-column w-12'>
                                                            <Text h6 className='m-0' >{x.itemDesc}</Text>
                                                            <Text h5 className='mt-2' color={x.itemTypeId === ItemTypeEnum.Gasto ? 'red' : 'green'}>{x.ammount} €</Text>
                                                        </div>                                                            
                                                    </div>
                                                </Card>                            
                                            ))}                        
                                        </div>
                                    </ScrollPanel>
                                </div>
                            </TabPanel>
                        </TabView>                        
                        :
                        <div className='flex gap-2 w-12'>
                            <div className='w-6 flex flex-column gap-2'>
                                <Text h5 className='m-0' color='primary' >Este Mes</Text>
                                <div style={{height:'100%', overflow:'hidden'}}>
                                    <ScrollPanel style={{ width: '100%', height: '400px' }}>
                                        <div className='flex flex-column gap-2'>
                                            {pendingPayItemsAux.map(x => (
                                                <Card
                                                    className='p-2'
                                                    key={x.itemId}
                                                    variant="bordered"
                                                >
                                                     <div className='flex justify-content-between'>
                                                     <div className='flex gap-2'>
                                                            {x.itemTypeId === ItemTypeEnum.Gasto ? <ArrowDownIcon style={{color:'red'}}/> : <ArrowUpIcon style={{color:'green'}}/>}
                                                            <Text h5 className='m-0' color='primary' >{x.itemName}</Text>
                                                        </div>                                                        <Text h5 className='m-0' color='primary' >{`${new Date(x.startDate).getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`}</Text>
                                                    </div>
                                                    <div className='flex gap-2 justify-content-between align-items-center'>
                                                        <div className='flex flex-column'>                                                            
                                                            <Text h6 className='m-0' >{x.itemDesc}</Text>
                                                            {x.ammountTypeId !== AmmountTypeEnum.Variable ? 
                                                                <Text h5 className='mt-2' color={x.itemTypeId === ItemTypeEnum.Gasto ? 'red' : 'green'}>{x.ammount} €</Text>
                                                                : <InputNumber suffix=' €' className='p-inputtext-sm' value={x.ammount} onChange={(e) => changeAmmount(e.value, x.itemId)}/>
                                                            }                                                            
                                                        </div>
                                                        <div className='flex' style={{height:'fit-content'}}>
                                                            <Button label={x.itemTypeId === ItemTypeEnum.Gasto ? "Pagar" : "Cobrar"} rounded onClick={() => payButtonClick(x.itemId)}/>
                                                        </div>
                                                    </div>
                                                </Card>                            
                                            ))}                        
                                        </div>
                                    </ScrollPanel>
                                </div>
                            </div>
                            <div className='w-6 flex flex-column gap-2'>
                                <Text h5 className='m-0' color='primary' >Proximo Mes</Text>
                                <div style={{height:'100%', overflow:'hidden'}}>
                                    <ScrollPanel style={{ width: '100%', height: '400px' }}>
                                        <div className='flex flex-column gap-2'>
                                            {pendingPayItemsNextMonth.map(x => (
                                                <Card
                                                    className='p-2'
                                                    key={x.itemId}
                                                    variant="bordered"
                                                >
                                                     <div className='flex justify-content-between'>
                                                     <div className='flex gap-2'>
                                                            {x.itemTypeId === ItemTypeEnum.Gasto ? <ArrowDownIcon style={{color:'red'}}/> : <ArrowUpIcon style={{color:'green'}}/>}
                                                            <Text h5 className='m-0' color='primary' >{x.itemName}</Text>
                                                        </div>                                                        <Text h5 className='m-0' color='primary' >{`${new Date(x.startDate).getDate()}-${new Date().getMonth() + 2}-${new Date().getFullYear()}`}</Text>
                                                    </div>
                                                    <div className='flex gap-2 justify-content-center align-items-center'>                                                        
                                                        <div className='flex flex-column w-12'>                                                          
                                                            <Text h6 className='m-0' >{x.itemDesc}</Text>
                                                            <Text h5 className='mt-2' color={x.itemTypeId === ItemTypeEnum.Gasto ? 'red' : 'green'}>{x.ammount} €</Text>
                                                        </div>                                                            
                                                    </div>
                                                </Card>                            
                                            ))}                        
                                        </div>
                                    </ScrollPanel>
                                </div>
                            </div>
                        </div>
                    }
                </div>                
            </div>            
        </>
    )
}

export default PendingPayItems