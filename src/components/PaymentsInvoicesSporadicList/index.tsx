import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Card, Text } from '@nextui-org/react';
import { AmmountTypeEnum } from 'enums/AmmountTypeEnum';
import { ItemResponse } from 'models/item/ItemResponse';

type listType = 'payment' | 'invoice';

interface ItemsGroupedByMonthYear {
    [key: string]: ItemResponse[];
}

interface Props {
    listType: listType;
    itemsList: ItemsGroupedByMonthYear;
};

const PaymentsInvoicesSporadicList: FC<Props> = ({ listType, itemsList }) => {
    const user = useSelector((state: any) => state.userState);    
    const isMobile = window.matchMedia('(max-width: 768px)').matches;    

    const getTotalAmmounts = (items: ItemResponse[] ): number => {
        let suma = 0;

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
                            <div className='flex flex-column gap-2' key={monthKey}>
                                <div className='flex flex-row justify-content-between'>
                                    <Text h5 className='m-0' color='primary' >{monthKey}</Text>                                                                                                  
                                    <Text h5 className='m-0' color='primary' >Total: <span style={{color: listType === 'payment' ? 'red' : 'green'}}>{getTotalAmmounts(itemsList[monthKey])} €</span></Text>
                                </div>
                                {getShortedList(itemsList[monthKey]).map((item: any, index: any) => (
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
                                                <Text h5 className='mt-2' color={listType === 'payment' ? 'red' : 'green'}>{item.ammountTypeId !== AmmountTypeEnum.Variable ? `${item.ammount} €` : listType === 'payment' ? 'Pago Variable' : 'Ingreso Variable'}</Text>
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
                            {listType === 'payment' ? 'No existen pagos que mostrar' : 'No existen ingresos que mostrar'}
                        </Card>
                        }                                            
                    </div>
                </ScrollPanel>
            </div>
        </>
    )
}

export default PaymentsInvoicesSporadicList