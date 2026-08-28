import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Card, Text } from '@nextui-org/react';
import { AmmountTypeEnum } from 'enums/AmmountTypeEnum';
import { ItemResponse } from 'models/item/ItemResponse';
import { DeleteItem } from 'services/item/ItemService';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

type listType = 'payment' | 'invoice';

interface ItemsGroupedByMonthYear {
    [key: string]: ItemResponse[];
}

interface Props {
    listType: listType;
    itemsList: ItemsGroupedByMonthYear;
    displayToast: (message: string, severity: string) => void;
};

const PaymentsInvoicesSporadicList: FC<Props> = ({ listType, itemsList, displayToast }) => {
    const user = useSelector((state: any) => state.userState);    
    const isMobile = window.matchMedia('(max-width: 768px)').matches;    
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [itemToDelete, setItemToDelete] = useState<number>();

    const handleDeleteClick = (itemId: number) => {
        setItemToDelete(itemId);
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;
        try {
            const response = await DeleteItem(itemToDelete);
            if (response.success) {
                displayToast(response.message, 'success');
            } else {
                displayToast(response.message, 'error');
            }
        } catch (error: any) {
            displayToast("Ocurrió un error al borrar el ítem", 'error');
        } finally {
            setShowDeleteDialog(false);
            setItemToDelete(undefined);
        }
    };

    const getTotalAmmounts = (items: ItemResponse[] ): number => {
        let suma: number = 0;

        for (const item of items) {
            suma += item.ammount;
        }

        return suma;
    }

    const getShortedList = (items: ItemResponse[]) : ItemResponse[]  => {
        return items.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    }         

    return (
        <>
            <div style={{height:'100%', overflow:'hidden'}}>
                <ScrollPanel style={{ width: '100%', height: `${isMobile ? '200px' : '400px'}` }}>
                    <div className='flex flex-column gap-2'>
                        {Object.keys(itemsList)?.length > 0 ? Object.keys(itemsList).map((monthKey) => (
                            <div className='flex flex-column gap-3 p-2' key={monthKey}>
                                <div className='flex flex-row justify-content-between'>
                                    <Text h5 className='m-0' color='primary' >{monthKey}</Text>                                                                                                  
                                    <Text h5 className='m-0' color='primary' >Total: <span style={{color: listType === 'payment' ? 'red' : 'green'}}>{getTotalAmmounts(itemsList[monthKey]).toFixed(2)} €</span></Text>
                                </div>
                                {getShortedList(itemsList[monthKey]).map((item: any, index: any) => (
                                    <Card
                                        style={{boxShadow: "rgba(0, 0, 0, 0.12) 0px 0px 4px 2px"}}
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
                                                <Text h6 className='m-0' color="secondary" >{item.accountName}</Text>
                                                <Text h6 className='m-0' >{item.itemDesc}</Text>                                                    
                                                <Text h5 className='mt-2' color={listType === 'payment' ? 'red' : 'green'}>{item.ammountTypeId !== AmmountTypeEnum.Variable ? `${item.ammount} €` : listType === 'payment' ? 'Pago Variable' : 'Ingreso Variable'}</Text>
                                            </div>
                                            <div className='flex flex-row gap-1'>
                                                <Button icon={<DeleteIcon />} className='p-0 pt-1' style={{ color:'red', height: 'fit-content', width:'2rem' }} rounded link onClick={() => handleDeleteClick(item.itemId)} />
                                            </div>                                                
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ))
                        :
                        <Card
                            style={{boxShadow: "rgba(0, 0, 0, 0.12) 0px 0px 4px 2px"}}
                            className='p-2'
                            variant="bordered"
                        >
                            {listType === 'payment' ? 'No existen pagos que mostrar' : 'No existen ingresos que mostrar'}
                        </Card>
                        }                                            
                    </div>
                </ScrollPanel>
            </div>

            <Dialog 
                position="center" 
                style={ isMobile ? { width: '95%' } : {width:'30%'}} 
                header="Confirmar Borrado"
                maximizable={false}
                visible={showDeleteDialog} 
                onHide={() => setShowDeleteDialog(false)}
            >
                <div className="flex flex-column gap-3">
                    <Text>¿Estás seguro de que quieres borrar este registro?</Text>
                    <div className="flex justify-content-end gap-2">
                        <Button label="Cancelar" icon="pi pi-times" onClick={() => setShowDeleteDialog(false)} className="p-button-text" />
                        <Button label="Borrar" icon="pi pi-check" onClick={handleDeleteConfirm} autoFocus severity="danger" />
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default PaymentsInvoicesSporadicList