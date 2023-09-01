import { FC } from 'react';

import { Text, Card } from '@nextui-org/react';

import { ToastContainer, toast } from 'react-toastify';
import { PendingPayItemsResponse } from 'models/item/PendingPayItemResponse';

import { Button } from 'primereact/button';
import { ScrollPanel } from 'primereact/scrollpanel';
import { AddItemPayment } from 'services/itemPayment/ItemPaymentService';

interface Props {    
    refresh: () => void;
    pendingPayItems: PendingPayItemsResponse[];
};

const PendingPayItems: FC<Props> = ({ refresh, pendingPayItems }) => {    

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
                        <Text h5 className='m-0' color='primary' >Pagos Pendientes</Text>
                    </div>
                    <div style={{height:'100%', overflow:'hidden'}}>
                    <ScrollPanel style={{ width: '100%', height: '300px' }}>
                        <div className='flex flex-column gap-2'>
                            {pendingPayItems.map(x => (
                                <Card
                                    className='p-2'
                                    key={x.itemId}
                                    variant="bordered"
                                >
                                    <div className='flex gap-2 justify-content-center align-items-center'>
                                        <div className='flex flex-column w-9'>
                                            <Text h5 className='m-0' color='primary' >{x.itemName}</Text>
                                            <Text h6 className='m-0' >{x.itemDesc}</Text>
                                            <Text h5 className='mt-2' color={'red'}>{x.ammount} €</Text>
                                        </div>
                                        <div className='flex w-3' style={{height:'fit-content'}}>
                                            <Button label="Pagar" rounded onClick={() => payButtonClick(x.itemId)}/>
                                        </div>
                                    </div>
                                </Card>                            
                            ))}                        
                        </div>
                    </ScrollPanel>
                    </div>
                </div>                
            </div>            
        </>
    )
}

export default PendingPayItems