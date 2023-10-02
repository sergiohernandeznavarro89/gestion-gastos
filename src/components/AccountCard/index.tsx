import { FC, useState } from "react"
import { Card } from '@nextui-org/react';
import Box from '@mui/joy/Box';
import { Text } from '@nextui-org/react';
import { Button } from 'primereact/button';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { AccountResponse } from "models/account/AccountResponse";
import PaymentForm from "components/PaymentForm";
import { Dialog } from "primereact/dialog";
import { ItemTypeEnum } from "enums/ItemTypeEnum";
import EditIcon from '@mui/icons-material/CreateOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { StyledCard } from "./styled";
import AccountForm from 'components/AccountForm';

interface Props{
    item: AccountResponse;
    displayToast: (message: string, severity: string) => void;
    fullWidth?: boolean;
}

const AccountCard: FC<Props> = ({item, displayToast, fullWidth = false}) => {

    const [showDialogPayment, setShowDialogPayment] = useState<boolean>(false);
    const [showDialogNewAccount, setShowDialogNewAccount] = useState<boolean>(false);
    const [itemType, setItemType] = useState<number>();

    return (
    <>
        <StyledCard
            className={`p-2 ${fullWidth && 'w-12'}`}
            style={ !fullWidth ? { minWidth: '150px', maxWidth: '200px' } : {}}
            key={item.accountName}
            variant="bordered"
        >
            <Box sx={{ whiteSpace: 'nowrap' }}>
                <div className={`flex ${fullWidth ? 'flex-row justify-content-between' : 'flex-column'}`}>
                    <div className="flex flex-column">                        
                        <Text h4 color='primary' >{item.accountName}</Text>                                                    
                        <Text h5 color={item.ammount > 0 ? 'green' : 'red'}>{item.ammount} €</Text>
                        { fullWidth && <div className="flex flex-row gap-1">
                            <Button icon={<EditIcon />} className='p-0 pt-1' style={{ height: 'fit-content', width:'2rem' }} rounded link onClick={() => setShowDialogNewAccount(true)}/>
                            <Button icon={<DeleteIcon />} className='p-0 pt-1' style={{ color:'red', height: 'fit-content', width:'2rem' }} rounded link />
                        </div>}
                    </div>
                    <div className={`flex ${fullWidth ? 'flex-column gap-2' : 'flex-row'} justify-content-between`}>
                        <Button icon={<ArrowCircleDownIcon />} severity='success' rounded text raised onClick={() => {setShowDialogPayment(true); setItemType(ItemTypeEnum.Ingreso)}}/>
                        <Button icon={<ArrowCircleUpIcon />} severity='danger' rounded text raised onClick={() => {setShowDialogPayment(true); setItemType(ItemTypeEnum.Gasto)}}/>
                    </div>
                </div>
            </Box>
        </StyledCard>

        <Dialog header={itemType === ItemTypeEnum.Ingreso ? `Nuevo Ingreso en ${item.accountName}` : `Nuevo Pago en ${item.accountName}`} maximizable visible={showDialogPayment} style={{ width: '95%' }} onHide={() => setShowDialogPayment(false)}>
            <PaymentForm itemType={itemType} cancelClick={() => setShowDialogPayment(false)} displayToast={displayToast} accountId={item.accountId}/>
        </Dialog>

        <Dialog header={`Edición cuenta ${item.accountName}`} maximizable visible={showDialogNewAccount} style={{ width: '95%' }} onHide={() => setShowDialogNewAccount(false)}>
            <AccountForm account={item} cancelClick={() => setShowDialogNewAccount(false)} displayToast={displayToast} />
        </Dialog>
    </>
  )
}

export default AccountCard