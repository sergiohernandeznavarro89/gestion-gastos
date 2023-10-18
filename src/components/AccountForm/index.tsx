import { Input } from '@nextui-org/react';
import { ValidationSpan } from 'pages/login/styled';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { AddAccount, UpdateAccount } from 'services/account/AccountService';
import { useSelector } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';
import { AccountResponse } from 'models/account/AccountResponse';
import { ResponseBase } from 'models/shared/ResponseBase';

interface Props {
    cancelClick: () => void;
    displayToast: (message: string, severity: string) => void;
    account?: AccountResponse;
};

const AccountForm: FC<Props> = ({ cancelClick, displayToast, account }) => {
    const user = useSelector((state: any) => state.userState);

    const defaultValues = {
        accountName: account ? account.accountName : '',
        ammount: account ? account.ammount : null
    };

    const {
        control,
        formState: { errors },
        handleSubmit,
        getValues,
        reset
    } = useForm({ defaultValues });

    const request = async (data: any): Promise<ResponseBase> => {        

        if(!account){
            var postData = {...data, ...{userId: user.userId}};
            const response = await AddAccount(postData);
            return response;
        }
        else{
            var putData = {...data, ...{accountId: account.accountId}};
            const response = await UpdateAccount(putData);
            return response;
        }
    }

    const onSubmit = async (data: any) => {
        const response = await request(data);

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
                <div className='formgrid grid'>
                    <div className='field flex flex-column col-12 md:col-6'>
                        <Controller
                            name="accountName"
                            control={control}
                            rules={{ required: 'Nombre es requerido' }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.accountName })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} className={`p-inputtext-sm w-full ${classNames({ 'p-invalid': fieldState.error })}`} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>Nombre</label>
                                    </span>
                                    {errors.accountName && <small className="p-error">{errors.accountName.message}</small>}
                                </>
                            )}
                        />                    
                    </div>

                    <div className='field flex flex-column col-12 md:col-6'>
                        <Controller
                            name="ammount"
                            control={control}
                            rules={{ required: 'Cantidad es requerido' }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.ammount })}></label>
                                    <span className="p-float-label">
                                        <InputNumber suffix=' €' id={field.name} value={field.value} className={`p-inputtext-sm w-full ${classNames({ 'p-invalid': fieldState.error })}`} onChange={(e) => field.onChange(e.value)} />
                                        <label htmlFor={field.name}>Cantidad</label>
                                    </span>
                                    {errors.ammount && <small className="p-error">{errors.ammount.message}</small>}
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

export default AccountForm