import { Input } from '@nextui-org/react';
import { ValidationSpan } from 'pages/login/styled';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { useSelector } from 'react-redux';
import { AddCategory, UpdateCategory } from 'services/category/CategoryService';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { CategoryResponse } from 'models/category/CategoryResponse';
import { ResponseBase } from 'models/shared/ResponseBase';

interface Props {
    cancelClick: () => void;
    displayToast: (message: string, severity: string) => void;
    category?: CategoryResponse;
};

const CategoryForm: FC<Props> = ({ cancelClick, displayToast, category }) => {
    const user = useSelector((state: any) => state.userState);

    const defaultValues = {
        categoryDesc: category ? category.categoryDesc : '',
    };

    const {
        control,
        formState: { errors },
        handleSubmit,
        getValues,
        reset
    } = useForm({ defaultValues });

    const request = async (data: any): Promise<ResponseBase> => {
        if(!category){
            const postData = { ...data, ...{ userId: user.userId } };
            const response = await AddCategory(postData);
            return response;
        }
        else{
            const putData = { ...data, ...{ categoryId: category.categoryId } };
            const response = await UpdateCategory(putData);
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
            <form className='flex flex-column gap-5 w-12' onSubmit={handleSubmit(onSubmit)}>
                <div className='flex flex-column gap-1'>
                    <Controller
                        name="categoryDesc"
                        control={control}
                        rules={{ required: 'Nombre es requerido' }}
                        render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.categoryDesc })}></label>
                                <span className="p-float-label mt-3">
                                    <InputText id={field.name} value={field.value} className={`p-inputtext-sm w-full ${classNames({ 'p-invalid': fieldState.error })}`} onChange={(e) => field.onChange(e.target.value)} />
                                    <label htmlFor={field.name}>Nombre</label>
                                </span>
                                {errors.categoryDesc && <small className="p-error">{errors.categoryDesc.message}</small>}
                            </>
                        )}
                    />                           
                </div>

                <div className='flex justify-content-end gap-2'>
                    <Button label="Cancelar" type='button' onClick={cancelClick} severity='danger' raised text size='small' />
                    <Button label="Guardar" severity='info' raised size='small' />
                </div>
            </form>
        </>
    )
}

export default CategoryForm