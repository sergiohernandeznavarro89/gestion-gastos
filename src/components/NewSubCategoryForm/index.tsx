import { Input } from '@nextui-org/react';
import { ValidationSpan } from 'pages/login/styled';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { useSelector } from 'react-redux';
import { CategoryResponse } from 'models/category/CategoryResponse';
import { AddSubCategory } from 'services/subCategory/SubCategoryService';

interface Props {
    cancelClick: () => void;
    displayToast: (message: string, severity: string) => void;
    selectedCategory: CategoryResponse | undefined;
};

const NewSubCategoryForm: FC<Props> = ({ cancelClick, displayToast, selectedCategory }) => {
    const user = useSelector((state: any) => state.userState);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

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
                    <Input
                        clearable
                        {...register("subcategoryDesc", { required: true })}
                        bordered
                        labelPlaceholder="Subcategoría"
                        color={!errors.subcategoryDesc ? 'primary' : 'error'}
                    />
                    {errors.subcategoryDesc && <ValidationSpan>SubCategoría es requerido</ValidationSpan>}
                </div>

                <div className='flex justify-content-end gap-2'>
                    <Button label="Cancelar" onClick={cancelClick} severity='danger' raised text size='small' />
                    <Button label="Guardar" severity='info' raised size='small' />
                </div>
            </form>
        </>
    )
}

export default NewSubCategoryForm