import { Input } from '@nextui-org/react';
import { ValidationSpan } from 'pages/login/styled';
import { FC } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { useSelector } from 'react-redux';
import { CategoryResponse } from 'models/category/CategoryResponse';
import { AddSubCategory } from 'services/subCategory/SubCategoryService';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';

interface Props {
    cancelClick: () => void;
    displayToast: (message: string, severity: string) => void;
    selectedCategory: CategoryResponse | undefined;
};

const NewSubCategoryForm: FC<Props> = ({ cancelClick, displayToast, selectedCategory }) => {
    const user = useSelector((state: any) => state.userState);
    
    const defaultValues = {
        subcategoryDesc: '',
    };

    const {
        control,
        formState: { errors },
        handleSubmit,
        getValues,
        reset
    } = useForm({ defaultValues });
    
    const onSubmit = async (data: any) => {
        const postData = { ...data, ...{ userId: user.userId, categoryId: selectedCategory?.categoryId } };
        const response = await AddSubCategory(postData);

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
                        name="subcategoryDesc"
                        control={control}
                        rules={{ required: 'Nombre es requerido' }}
                        render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.subcategoryDesc })}></label>
                                <span className="p-float-label">
                                    <InputText id={field.name} value={field.value} className={`p-inputtext-sm w-full ${classNames({ 'p-invalid': fieldState.error })}`} onChange={(e) => field.onChange(e.target.value)} />
                                    <label htmlFor={field.name}>Nombre</label>
                                </span>
                                {errors.subcategoryDesc && <small className="p-error">{errors.subcategoryDesc.message}</small>}
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

export default NewSubCategoryForm