
import { FC, useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import 'moment/locale/es';
import { ResponseBase } from 'models/shared/ResponseBase';
import { DebtResponse } from 'models/debt/DebtResponse';
import { AddDebtPaymentCommand } from 'models/debtPayment/AddDebtPaymentCommand';
import { AddDebtPayment } from 'services/debtPayment/DebtPaymentService';
import { AccountResponse } from 'models/account/AccountResponse';
import { Message } from 'primereact/message';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbolOutlined';

interface Props {
    cancelClick: () => void;
    displayToast: (message: string, severity: string) => void;
    debt: DebtResponse;    
    accountList: AccountResponse[];
};

const ReduceDebtForm: FC<Props> = ({ cancelClick, displayToast, debt, accountList }) => {
    
    const [dropdownAccountsList, setDropdownAccountsList] = useState<AccountResponse[]>([]);

    useEffect(() => {
      if(accountList.length > 0){
        var dropdownList = accountList.map(x => {
            return {...x, ...{accountName: `${x.accountName} - ${x.ammount}€`}};
        });
        setDropdownAccountsList(dropdownList);
      }      
    }, [accountList])
    
    
    const defaultValues = {        
        amount: '',
        accountId: null,        
    };

    const {
        control,
        formState: { errors },
        handleSubmit,
        getValues,
    } = useForm({ defaultValues });
    
    const request = async (data: AddDebtPaymentCommand): Promise<ResponseBase> => {
        const requestData = {
            debtId: debt.debtId,
            amount: data.amount,
            accountId: data.accountId
        }

        const response = await AddDebtPayment(requestData);
        return response;
    }

    const onSubmit = async (data: any) => {        
        var response = await request(data);

        if (response?.success) {
            cancelClick();
            displayToast(response.message, 'success');
        }
        else {
            displayToast(response.message, 'error');
        }
    };    

    return (
        <>
            <form className='flex flex-column gap-4' onSubmit={handleSubmit(onSubmit)}>                                
                <div className='flex align-items-center w-12 justify-content-center'>
                    <Message severity="info" text={<b>Deuda pendiente: {debt.currentAmount} € </b>} />
                </div>
                <div className='formgrid grid mt-3'>
                    <div className='field flex flex-column col-12 md:col-6'>
                        <Controller
                            name="accountId"
                            control={control}
                            rules={{ required: 'Cuenta bancaria es requerida' }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.accountId })}></label>
                                    <span className="p-float-label">
                                        <Dropdown appendTo='self' showClear value={field.value} options={dropdownAccountsList} onChange={(e) => field.onChange(e.target.value)} optionValue='accountId' optionLabel="accountName" className={`p-inputtext-sm w-full ${classNames({ 'p-invalid': fieldState.error })}`} />
                                        <label htmlFor={field.name}>Cuenta Bancaria</label>
                                    </span>
                                    {errors.accountId && <small className="p-error">{errors.accountId.message}</small>}
                                </>
                            )}
                        />
                    </div>                     

                    <div className='field flex flex-column col-12 md:col-6'>
                        <Controller
                            name="amount"
                            control={control}
                            rules={{ required: 'Cantidad a reducir es requerido' }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.amount })}></label>                                    
                                    <span className="p-float-label p-input-icon-right">
                                        <EuroSymbolIcon/>
                                        <InputText prefix=' €' id={field.name} value={field.value} className={`p-inputtext-sm w-full ${classNames({ 'p-invalid': fieldState.error })}`} onChange={(e) => field.onChange(e.target.value)} />                                                                                
                                        <label htmlFor={field.name}>Cantidad a reducir</label>
                                    </span>
                                    {errors.amount && <small className="p-error">{errors.amount.message}</small>}
                                </>
                            )}
                        />     
                    </div>
                </div>
                <div className='flex justify-content-end gap-2'>
                    <Button label="Cancelar" type='button' onClick={cancelClick} severity='danger' raised text size='small' />
                    <Button label="Guardar" severity='info' raised size='small' />
                </div>
            </form>
        </>
    )
}

export default ReduceDebtForm