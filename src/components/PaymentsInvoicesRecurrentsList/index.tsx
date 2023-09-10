import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Card, Text } from '@nextui-org/react';
import { AmmountTypeEnum } from 'enums/AmmountTypeEnum';
import { ItemResponse } from 'models/item/ItemResponse';
import { Button } from 'primereact/button';
import EditIcon from '@mui/icons-material/CreateOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Dialog } from 'primereact/dialog';
import PaymentForm from 'components/PaymentForm';
import { ItemTypeEnum } from 'enums/ItemTypeEnum';

type listType = 'payment' | 'invoice';

interface Props {
    listType: listType;
    itemsList: ItemResponse[];
    displayToast: (message: string, severity: string) => void;
    itemType: number;
};

const PaymentsInvoicesRecurrentsList: FC<Props> = ({ listType, itemsList, displayToast, itemType }) => {
    const user = useSelector((state: any) => state.userState);    
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const [selectedItem, setSelectedItem] = useState<ItemResponse>();
    const [showDialogPayment, setShowDialogPayment] = useState<boolean>(false);

    return (
        <>
            <div style={{height:'100%', overflow:'hidden'}}>
                <ScrollPanel style={{ width: '100%', height: `${isMobile ? '200px' : '400px'}` }}>
                    <div className='flex flex-column gap-2'>
                        {itemsList.length > 0 ? 
                            itemsList.map(x => 
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
                                            <Text h5 className='mt-2' color={listType === 'payment' ? 'red' : 'green'}>{x.ammountTypeId !== AmmountTypeEnum.Variable ? `${x.ammount} €` : listType === 'payment' ? 'Pago Variable' : 'Ingreso Variable'}</Text>
                                        </div>
                                        <div className='flex flex-row gap-1'>
                                            <Button icon={<EditIcon />} className='p-0 pt-1' style={{ height: 'fit-content', width:'2rem' }} rounded link onClick={() => {setSelectedItem(x); setShowDialogPayment(true)}}/>
                                            <Button icon={<DeleteIcon />} className='p-0 pt-1' style={{ color:'red', height: 'fit-content', width:'2rem' }} rounded link />
                                        </div>
                                    </div>
                                </Card>
                            )
                        : 
                            <Card
                                className='p-2'
                                variant="bordered"
                            >
                                {listType === 'payment' ? 'No existen pagos que mostrar' : 'No existen ingresos que mostrar'}
                            </Card>
                        }
                    </div>
                </ScrollPanel>
            </div>

            <Dialog header={`Edición ${selectedItem?.itemName}`} maximizable visible={showDialogPayment} style={{ width: '95%' }} onHide={() => setShowDialogPayment(false)}>
                <PaymentForm itemType={itemType} cancelClick={() => setShowDialogPayment(false)} displayToast={displayToast} accountId={selectedItem?.accountId} item={selectedItem}/>
            </Dialog>    
        </>
    )
}

export default PaymentsInvoicesRecurrentsList