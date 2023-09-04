import { FC } from 'react';

import { Text, Card } from '@nextui-org/react';

import { ToastContainer, toast } from 'react-toastify';
import { PendingPayItemsResponse } from 'models/item/PendingPayItemResponse';

import { Button } from 'primereact/button';
import { ScrollPanel } from 'primereact/scrollpanel';
import { TabView, TabPanel } from 'primereact/tabview';

import { AddItemPayment } from 'services/itemPayment/ItemPaymentService';

interface Props {    
    refresh: () => void;
    pendingPayItems: PendingPayItemsResponse[];
    pendingPayItemsNextMonth: PendingPayItemsResponse[];
};

const PendingPayItems: FC<Props> = ({ refresh, pendingPayItems, pendingPayItemsNextMonth }) => {    

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
        var response = await AddItemPayment(itemId);
        
        if(response.success){
            displayToast("Pago efectuado correctamente", 'success');
            refresh();
        }
        else{
            displayToast("Error al efectuar el pago", 'error');
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
                <div className='flex flex-column gap-3'>
                    <div className='flex flex-row align-items-center gap-1'>
                        <Text h4 className='m-0' color='primary' >Pagos Pendientes</Text>
                    </div>
                    {isMobile ?
                        <TabView>
                            <TabPanel header="Este Mes">
                                <div style={{height:'100%', overflow:'hidden'}}>
                                    <ScrollPanel style={{ width: '100%', height: '400px' }}>
                                        <div className='flex flex-column gap-2'>
                                            {pendingPayItems.map(x => (                                                
                                                <Card
                                                    className='p-2'
                                                    key={x.itemId}
                                                    variant="bordered"
                                                >
                                                    <div className='flex justify-content-between'>
                                                        <Text h5 className='m-0' color='primary' >{x.itemName}</Text>
                                                        <Text h5 className='m-0' color='primary' >{`${new Date(x.startDate).getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`}</Text>
                                                    </div>
                                                    <div className='flex gap-2 justify-content-between align-items-center'>
                                                        <div className='flex flex-column'>                                                            
                                                            <Text h6 className='m-0' >{x.itemDesc}</Text>
                                                            <Text h5 className='mt-2' color={'red'}>{x.ammount} €</Text>
                                                        </div>
                                                        <div className='flex' style={{height:'fit-content'}}>
                                                            <Button label="Pagar" rounded onClick={() => payButtonClick(x.itemId)}/>
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
                                                        <Text h5 className='m-0' color='primary' >{x.itemName}</Text>
                                                        <Text h5 className='m-0' color='primary' >{`${new Date(x.startDate).getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`}</Text>
                                                    </div>
                                                    <div className='flex gap-2 justify-content-center align-items-center'>
                                                        <div className='flex flex-column w-12'>
                                                            <Text h6 className='m-0' >{x.itemDesc}</Text>
                                                            <Text h5 className='mt-2' color={'red'}>{x.ammount} €</Text>
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
                                            {pendingPayItems.map(x => (
                                                <Card
                                                    className='p-2'
                                                    key={x.itemId}
                                                    variant="bordered"
                                                >
                                                     <div className='flex justify-content-between'>
                                                        <Text h5 className='m-0' color='primary' >{x.itemName}</Text>
                                                        <Text h5 className='m-0' color='primary' >{`${new Date(x.startDate).getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`}</Text>
                                                    </div>
                                                    <div className='flex gap-2 justify-content-between align-items-center'>
                                                        <div className='flex flex-column'>                                                            
                                                            <Text h6 className='m-0' >{x.itemDesc}</Text>
                                                            <Text h5 className='mt-2' color={'red'}>{x.ammount} €</Text>
                                                        </div>
                                                        <div className='flex' style={{height:'fit-content'}}>
                                                            <Button label="Pagar" rounded onClick={() => payButtonClick(x.itemId)}/>
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
                                                        <Text h5 className='m-0' color='primary' >{x.itemName}</Text>
                                                        <Text h5 className='m-0' color='primary' >{`${new Date(x.startDate).getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`}</Text>
                                                    </div>
                                                    <div className='flex gap-2 justify-content-center align-items-center'>                                                        
                                                        <div className='flex flex-column w-12'>                                                          
                                                            <Text h6 className='m-0' >{x.itemDesc}</Text>
                                                            <Text h5 className='mt-2' color={'red'}>{x.ammount} €</Text>
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