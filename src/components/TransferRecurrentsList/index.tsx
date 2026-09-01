import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Card, Text } from '@nextui-org/react';
import { TransferResponse } from 'models/transfer/TransferResponse';
import { Button } from 'primereact/button';
import EditIcon from '@mui/icons-material/CreateOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Dialog } from 'primereact/dialog';
import TransferForm from 'components/TransferForm';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

import { DeleteTransfer } from 'services/transfer/TransferService';

interface Props {
    itemsList: TransferResponse[];
    displayToast: (message: string, severity: string) => void;
};

const TransferRecurrentsList: FC<Props> = ({ itemsList, displayToast }) => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const [selectedItem, setSelectedItem] = useState<TransferResponse>();
    const [showDialogPayment, setShowDialogPayment] = useState<boolean>(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [itemToDelete, setItemToDelete] = useState<number>();

    const handleDeleteClick = (transferId: number) => {
        setItemToDelete(transferId);
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;
        try {
            const response = await DeleteTransfer(itemToDelete);
            if (response.success) {
                displayToast(response.message, 'success');
            } else {
                displayToast(response.message, 'error');
            }
        } catch (error: any) {
            displayToast("Ocurrió un error al borrar la transferencia", 'error');
        } finally {
            setShowDeleteDialog(false);
            setItemToDelete(undefined);
        }
    };

    return (
        <>
            <div style={{height:'100%', overflow:'hidden'}}>
                <ScrollPanel style={{ width: '100%', height: `${isMobile ? '200px' : '400px'}` }}>
                    <div className='flex flex-column gap-3 p-2'>
                        {itemsList.length > 0 ? 
                            itemsList.map(x => 
                                <Card
                                    style={{boxShadow: "rgba(0, 0, 0, 0.12) 0px 0px 4px 2px"}}
                                    className='p-2'
                                    key={x.transferId}
                                    variant="bordered"
                                >
                                    <div className='flex justify-content-between align-items-center'>
                                        <div className='flex align-items-center gap-2'>
                                            <CompareArrowsIcon color="primary" />
                                            <Text h5 className='m-0' color='primary' >{x.transferName}</Text>                                                
                                        </div>
                                        <Text h5 className='m-0' color='primary' >{`${new Date(x.startDate).getDate()}-${new Date(x.startDate).getMonth() + 1}-${new Date(x.startDate).getFullYear()}`}</Text>
                                    </div>
                                    <div className='flex gap-2 justify-content-between align-items-center mt-2'>
                                        <div className='flex flex-column'>                                                            
                                            <Text h6 className='m-0' color="secondary" >{x.originAccountName} {'->'} {x.destinationAccountName}</Text>
                                            <Text h6 className='m-0' >{x.transferDesc}</Text>                                                    
                                            <Text h5 className='mt-2' color="primary">{`${x.ammount} €`}</Text>
                                        </div>
                                        <div className='flex flex-row gap-1'>
                                            <Button icon={<EditIcon />} className='p-0 pt-1' style={{ height: 'fit-content', width:'2rem' }} rounded link onClick={() => {setSelectedItem(x); setShowDialogPayment(true)}}/>
                                            <Button icon={<DeleteIcon />} className='p-0 pt-1' style={{ color:'red', height: 'fit-content', width:'2rem' }} rounded link onClick={() => handleDeleteClick(x.transferId)} />
                                        </div>
                                    </div>
                                </Card>
                            )
                        : 
                            <Card
                                style={{boxShadow: "rgba(0, 0, 0, 0.12) 0px 0px 4px 2px"}}
                                className='p-2'
                                variant="bordered"
                            >
                                No existen transferencias que mostrar
                            </Card>
                        }
                    </div>
                </ScrollPanel>
            </div>

            <Dialog 
                position="center" 
                style={ isMobile ? { width: '95%' } : {width:'50%'}} 
                header={`Edición ${selectedItem?.transferName}`} 
                maximizable 
                visible={showDialogPayment} 
                onHide={() => setShowDialogPayment(false)}
            >
                {selectedItem && (
                    <TransferForm 
                        cancelClick={() => setShowDialogPayment(false)} 
                        displayToast={displayToast} 
                        transfer={selectedItem} 
                    />
                )}
            </Dialog>

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

export default TransferRecurrentsList
