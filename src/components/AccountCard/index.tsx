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
import { DeleteAccount } from 'services/account/AccountService';

interface Props{
    item: AccountResponse;
    displayToast: (message: string, severity: string) => void;
    fullWidth?: boolean;
}

const AccountCard: FC<Props> = ({item, displayToast, fullWidth = false}) => {

    const [showDialogPayment, setShowDialogPayment] = useState<boolean>(false);
    const [showDialogNewAccount, setShowDialogNewAccount] = useState<boolean>(false);
    const [itemType, setItemType] = useState<number>();
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const isMobile = window.matchMedia('(max-width: 768px)').matches;    

    const handleDeleteClick = () => {
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await DeleteAccount(item.accountId);
            if (response.success) {
                displayToast(response.message, 'success');
            } else {
                displayToast(response.message, 'error');
            }
        } catch (error: any) {
            displayToast("Ocurrió un error al borrar la cuenta", 'error');
        } finally {
            setShowDeleteDialog(false);
        }
    };

    return (
    <>
        
        <StyledCard
            className={`p-2 w-12`}
            style={ !fullWidth ? { minWidth: '150px', maxWidth: '200px' } : {width:'100%'}}
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
                            <Button icon={<DeleteIcon />} className='p-0 pt-1' style={{ color:'red', height: 'fit-content', width:'2rem' }} rounded link onClick={handleDeleteClick} />
                        </div>}
                    </div>
                    <div className={`flex ${fullWidth ? 'flex-column gap-2' : 'flex-row'} justify-content-between`}>
                        <Button icon={<ArrowCircleDownIcon />} severity='success' rounded text raised onClick={() => {setShowDialogPayment(true); setItemType(ItemTypeEnum.Ingreso)}}/>
                        <Button icon={<ArrowCircleUpIcon />} severity='danger' rounded text raised onClick={() => {setShowDialogPayment(true); setItemType(ItemTypeEnum.Gasto)}}/>
                    </div>
                </div>
            </Box>
        </StyledCard>        

        <Dialog 
            position="center" 
            style={ isMobile ? { width: '95%' } : {width:'50%'}} 
            header={itemType === ItemTypeEnum.Ingreso ? `Nuevo Ingreso en ${item.accountName}` : `Nuevo Pago en ${item.accountName}`} 
            maximizable 
            visible={showDialogPayment} 
            onHide={() => setShowDialogPayment(false)}
        >
            <PaymentForm itemType={itemType} cancelClick={() => setShowDialogPayment(false)} displayToast={displayToast} accountId={item.accountId}/>
        </Dialog>

        <Dialog 
            position="center" 
            style={ isMobile ? { width: '95%' } : {width:'30%'}} 
            header={`Edición cuenta ${item.accountName}`} 
            maximizable 
            visible={showDialogNewAccount} 
            onHide={() => setShowDialogNewAccount(false)}
        >
            <AccountForm account={item} cancelClick={() => setShowDialogNewAccount(false)} displayToast={displayToast} />
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
                <Text>¿Estás seguro de que quieres borrar esta cuenta?</Text>
                <div className="flex justify-content-end gap-2">
                    <Button label="Cancelar" icon="pi pi-times" onClick={() => setShowDeleteDialog(false)} className="p-button-text" />
                    <Button label="Borrar" icon="pi pi-check" onClick={handleDeleteConfirm} autoFocus severity="danger" />
                </div>
            </div>
        </Dialog>
    </>
  )
}

export default AccountCard