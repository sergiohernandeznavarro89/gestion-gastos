import { Input } from '@nextui-org/react';
import { ValidationSpan } from 'pages/login/styled';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { AddAccount } from 'services/account/AccountService';
import { useSelector } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';

interface Props {
    cancelClick: () => void;
    displayToast: (message: string, severity: string) => void;
};

const NewAccountForm: FC<Props> = ({ cancelClick, displayToast }) => {
    const user = useSelector((state: any) => state.userState);

    const defaultValues = {
        accountName: '',
        ammount: null
    };

    const {
        control,
        formState: { errors },
        handleSubmit,
        getValues,
        reset
    } = useForm({ defaultValues });

    const onSubmit = async (data: any) => {
        const postData = { ...data, ...{ userId: user.userId } };
        const response = await AddAccount(postData);

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

            <form className='flex flex-column gap-4 w-12' onSubmit={handleSubmit(onSubmit)}>
                <div className='flex flex-column gap-1'>
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

                <div className='flex flex-column gap-1'>
                    <Controller
                        name="ammount"
                        control={control}
                        rules={{ required: 'Cantidad es requerido' }}
                        render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.ammount })}></label>
                                <span className="p-float-label">
                                    <InputNumber id={field.name} value={field.value} className={`p-inputtext-sm w-full ${classNames({ 'p-invalid': fieldState.error })}`} onChange={(e) => field.onChange(e.value)} mode="currency" currency="EUR" />
                                    <label htmlFor={field.name}>Cantidad</label>
                                </span>
                                {errors.ammount && <small className="p-error">{errors.ammount.message}</small>}
                            </>
                        )}
                    />                    
                </div>

                <div className='flex justify-content-end gap-2'>
                    <Button label="Cancelar" onClick={cancelClick} severity='danger' raised text size='small' />
                    <Button label="Guardar" severity='info' raised size='small' />
                </div>
            </form>
        </>
    )
}

export default NewAccountForm