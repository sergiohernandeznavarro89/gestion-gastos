import { FC, useState } from "react"
import { Card } from '@nextui-org/react';
import { Text } from '@nextui-org/react';
import { Button } from 'primereact/button';
import { DebtResponse } from "models/debt/DebtResponse";
import { DebtTypeEnum } from 'enums/DebtTypeEnum';
import ArrowDownIcon from '@mui/icons-material/ArrowCircleDownOutlined';
import ArrowUpIcon from '@mui/icons-material/ArrowCircleUpOutlined';
import PersonIcon from '@mui/icons-material/PersonOutlineOutlined';
import { Dialog } from 'primereact/dialog';
import DebtForm from "components/DebtForm";
import EditIcon from '@mui/icons-material/CreateOutlined';
import { AccountResponse } from "models/account/AccountResponse";
import ReduceDebtForm from "components/ReduceDebtForm";
import { EventBus } from "primereact/utils";

interface Props{
    debt: DebtResponse;
    displayToast: (message: string, severity: string) => void;
    accountList: AccountResponse[];
}

const DebtCard: FC<Props> = ({debt, displayToast, accountList}) => {    

    const isMobile = window.matchMedia('(max-width: 768px)').matches;    
    const [showDialogDebt, setShowDialogDebt] = useState<boolean>(false);
    const [showDialogReduceDebt, setShowDialogReduceDebt] = useState<boolean>(false);    

    return (
    <>        
        <div className='field flex col-12 md:col-4'>
            <Card
                style={{boxShadow: "rgba(0, 0, 0, 0.12) 0px 0px 4px 2px"}}
                className='p-2'
                key={debt.debtId}
                variant="bordered"
            >
                <div className='flex justify-content-between align-items-center'>
                    <div className='flex flex-column'>
                        <div className='flex gap-2 align-items-center'>
                            {debt.debtTypeId === DebtTypeEnum.Saliente ? <ArrowUpIcon style={{color:'red'}}/> : <ArrowDownIcon style={{color:'green'}}/>}
                            <Text h5 className='m-0' color='primary' >{debt.debtName}</Text>
                            {debt.currentAmount !== 0 && <Button icon={<EditIcon />} className='p-0 pt-1' style={{ height: 'fit-content', width:'2rem' }} rounded link onClick={() => setShowDialogDebt(true)}/>}
                        </div>
                        <div className='flex flex-row gap-1'>
                            <PersonIcon style={debt.debtTypeId === DebtTypeEnum.Saliente ? {color: 'red'} : {color: 'green'}}/>
                            <Text h5 className='m-0' color='primary' >{debt.debtorName}</Text>
                        </div>   
                    </div>
                    <Text h5 className='m-0' color={`${debt.currentAmount > 0 ? 'primary' : 'green'}`} >
                        {debt.currentAmount > 0 ? 
                            `${new Date(debt.date).getDate()}-${new Date(debt.date).getMonth() + 1}-${new Date(debt.date).getFullYear()}` 
                        :
                            debt.completedDate && `${new Date(debt.completedDate).getDate()}-${new Date(debt.completedDate).getMonth() + 1}-${new Date(debt.completedDate).getFullYear()}`
                        }
                    </Text>
                </div>
                <div className='flex flex-row justify-content-between align-items-center'>
                    <div className='flex flex-column mt-2'>                                        
                        <div className='flex flex-row gap-1'>
                            <Text h5 className='m-0' >Deuda inicial:</Text>
                            <Text h5 className='m-0' color='green' >{debt.startAmount} €</Text>
                        </div>                         
                        <div className='flex flex-row gap-1'>
                            <Text h5 className='m-0' >Deuda actual:</Text>
                            <Text h5 className='m-0' color={`${debt.currentAmount === 0 ? 'green' : 'red'}`} >{debt.currentAmount} €</Text>
                        </div>                                                                                  
                    </div>
                    <div className='flex' style={{height:'fit-content'}}>
                        <Button label="Reducir deuda" rounded onClick={() => setShowDialogReduceDebt(true)}/>
                    </div>
                </div>                                        
            </Card>  

            {/* Editar deuda */}
            <Dialog 
                position="center" 
                style={ isMobile ? { width: '95%' } : {width:'50%'}} 
                header={`Editar Deuda ${debt.debtName}`} 
                maximizable 
                visible={showDialogDebt} 
                onHide={() => setShowDialogDebt(false)}
            >
                <DebtForm
                    cancelClick={() => setShowDialogDebt(false)}
                    displayToast={displayToast}
                    debt={debt}
                />
            </Dialog>            
            
            <Dialog 
                position="center" 
                style={ isMobile ? { width: '95%' } : {width:'50%'}} 
                header={`Reducir ${debt.debtName}`} 
                maximizable 
                visible={showDialogReduceDebt} 
                onHide={() => setShowDialogReduceDebt(false)}
            >
                <ReduceDebtForm
                    accountList={accountList}
                    cancelClick={() => setShowDialogReduceDebt(false)}
                    debt={debt}
                    displayToast={displayToast}
                />
            </Dialog>            
        </div>
    </>
  )
}

export default DebtCard