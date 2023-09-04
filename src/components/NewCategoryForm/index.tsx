import { Input } from '@nextui-org/react';
import { ValidationSpan } from 'pages/login/styled';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { useSelector } from 'react-redux';
import { AddCategory } from 'services/category/CategoryService';

interface Props {
    cancelClick: () => void;
    displayToast: (message: string, severity: string) => void;
};

const NewCategoryForm: FC<Props> = ({ cancelClick, displayToast }) => {
    const user = useSelector((state: any) => state.userState);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        const postData = { ...data, ...{ userId: user.userId } };
        const response = await AddCategory(postData);

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
                    <Input
                        clearable
                        {...register("categoryDesc", { required: true })}
                        bordered
                        labelPlaceholder="Categoría"
                        color={!errors.categoryDesc ? 'primary' : 'error'}
                    />
                    {errors.categoryDesc && <ValidationSpan>Categoría es requerido</ValidationSpan>}
                </div>

                <div className='flex justify-content-end gap-2'>
                    <Button label="Cancelar" onClick={cancelClick} severity='danger' raised text size='small' />
                    <Button label="Guardar" severity='info' raised size='small' />
                </div>
            </form>
        </>
    )
}

export default NewCategoryForm