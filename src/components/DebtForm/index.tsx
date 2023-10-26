
import { FC, useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { useSelector } from 'react-redux';
import { Text } from '@nextui-org/react';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { ButtonTag, ButtonTagSelected } from './styled';
import { Dropdown } from 'primereact/dropdown';
import { CategoryResponse } from 'models/category/CategoryResponse';
import { SubCategoryResponse } from 'models/subCategory/SubCategoryResponse';
import { GetCategoriesByUser } from 'services/category/CategoryService';
import { GetSubCategoriesByUser } from 'services/subCategory/SubCategoryService';
import 'moment/locale/es';
import { ResponseBase } from 'models/shared/ResponseBase';
import { DebtResponse } from 'models/debt/DebtResponse';
import { DebtTypeEnum } from 'enums/DebtTypeEnum';
import { AddDebt } from 'services/debt/debtService';
import { UpdateDebt } from '../../services/debt/debtService';
import { UpdateDebtCommand } from 'models/debt/UpdateDebtCommand';

interface Props {
    cancelClick: () => void;
    displayToast: (message: string, severity: string) => void;
    debt?: DebtResponse;    
};

const DebtForm: FC<Props> = ({ cancelClick, displayToast, debt }) => {
    const user = useSelector((state: any) => state.userState);
    const [debtTypeId, setDebtTypeId] = useState<number>(debt ? debt.debtTypeId : DebtTypeEnum.Entrante);
    const [categoriesList, setCategoriesList] = useState<CategoryResponse[]>([]);
    const [subCategoriesList, setSubCategoriesList] = useState<SubCategoryResponse[]>([]);
    const [subCategoriesFilterList, setSubCategoriesFilterList] = useState<SubCategoryResponse[]>([]);
    const isMobile = window.matchMedia('(max-width: 768px)').matches;    

    useEffect(() => {
        if(debt?.categoryId && subCategoriesList.length > 0){
            changeCategory();
        }
    }, [debt, subCategoriesList])
    

    useEffect(() => {
        if (user.userId) {            
            (async () => {
                const [
                    categoriesResponse,
                    subCategoriesResponse
                ] = await Promise.all([
                    GetCategoriesByUser(user.userId),
                    GetSubCategoriesByUser(user.userId)
                ]);
                
                setCategoriesList(categoriesResponse);
                setSubCategoriesList(subCategoriesResponse);                           
            })();
        }
    }, [user.userId]);
    

    const defaultValues = {        
        debtName: debt ? debt.debtName : '',
        debtorName: debt ? debt.debtorName : '',
        startAmount: debt ? debt.startAmount.toString() : '',        
        categoryId: debt ? debt.categoryId : null,
        subCategoryId: debt ? debt.subCategoryId : null,
        currentAmount: debt ? debt.currentAmount.toString() : ''
    };

    const {
        control,
        formState: { errors },
        handleSubmit,
        getValues,
    } = useForm({ defaultValues });
    
    const request = async (data: UpdateDebtCommand): Promise<ResponseBase> => {
        const requestData = {
            debtName: data.debtName,
            debtorName: data.debtorName,
            startAmount: data.startAmount,
            categoryId: data.categoryId,
            subCategoryId: data.subCategoryId,
            debtTypeId: debtTypeId
        }

        if(!debt){
            var postData = {...requestData, ...{userId: user.userId}};
            const response = await AddDebt(postData);
            return response;
        }
        else{
            var putData = {...requestData, ...{debtId: debt.debtId, currentAmount: data.currentAmount}};
            const response = await UpdateDebt(putData);
            return response;
        }
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

    const changeCategory = () => {
        const categoryIdSelected = getValues('categoryId');
        if(categoryIdSelected){
            setSubCategoriesFilterList(subCategoriesList.filter(x => x.categoryId === categoryIdSelected));
        }
        else{
            setSubCategoriesFilterList([]);
        }
    };

    return (
        <>
            <form className='flex flex-column gap-4' onSubmit={handleSubmit(onSubmit)}>                
                <div className={`flex ${isMobile ? 'flex-column gap-2' : 'flex-row mb-3'} justify-content-center`}>
                    <div className={`flex flex-column gap-2 w-12 md:w-6 ${!isMobile && 'align-items-center'}`}>
                        <Text h6 className='m-0' color='primary'>Tipo de Deuda</Text>
                        <div className='flex gap-2 flex-wrap'>
                            {debtTypeId === DebtTypeEnum.Entrante ?
                            <>
                                <ButtonTagSelected label='Entrante' rounded type='button'/>
                                <ButtonTag label='Saliente' rounded onClick={() => setDebtTypeId(DebtTypeEnum.Saliente) } type='button'/>
                            </>      
                            :
                            <>
                                <ButtonTag label='Entrante' rounded onClick={() => setDebtTypeId(DebtTypeEnum.Entrante) } type='button'/>
                                <ButtonTagSelected label='Saliente' rounded type='button'/>
                            </>}
                        </div>
                    </div>
                </div>
                <div className='formgrid grid'>
                    <div className='field flex flex-column col-12 md:col-6'>
                        <Controller                        
                            name="debtName"
                            control={control}
                            rules={{ required: 'Nombre deuda es requerido' }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.debtName })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} className={`p-inputtext-sm w-full ${classNames({ 'p-invalid': fieldState.error })}`} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>Nombre deuda</label>
                                    </span>
                                    {errors.debtName && <small className="p-error">{errors.debtName.message}</small>}
                                </>
                            )}
                        />
                    </div>

                    <div className='field flex flex-column col-12 md:col-6'>
                        <Controller
                            name="startAmount"
                            control={control}
                            rules={{ required: 'Cantidad Deuda inicial es requerido' }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.startAmount })}></label>
                                    <span className="p-float-label">
                                        <InputText prefix=' €' id={field.name} value={field.value} className={`p-inputtext-sm w-full ${classNames({ 'p-invalid': fieldState.error })}`} onChange={(e) => field.onChange(e.target.value)} />                                        
                                        <label htmlFor={field.name}>{debt ? 'Cantidad Deuda Inicial' : 'Cantidad Deuda'}</label>
                                    </span>
                                    {errors.startAmount && <small className="p-error">{errors.startAmount.message}</small>}
                                </>
                            )}
                        />     
                    </div>

                    {debt && <div className='field flex flex-column col-12 md:col-6'>
                        <Controller
                            name="currentAmount"
                            control={control}
                            rules={{ required: 'Cantidad Deuda actual es requerido' }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.currentAmount })}></label>
                                    <span className="p-float-label">
                                        <InputText prefix=' €' id={field.name} value={field.value} className={`p-inputtext-sm w-full ${classNames({ 'p-invalid': fieldState.error })}`} onChange={(e) => field.onChange(e.target.value)} />                                        
                                        <label htmlFor={field.name}>Cantidad Deuda actual</label>
                                    </span>
                                    {errors.currentAmount && <small className="p-error">{errors.currentAmount.message}</small>}
                                </>
                            )}
                        />     
                    </div>}

                    <div className='field flex flex-column col-12 md:col-6'>
                        <Controller                        
                            name="debtorName"
                            control={control}
                            rules={{ required: `${debtTypeId === DebtTypeEnum.Entrante ? 'Nombre Deudor es requerido' : 'Nombre Acreedor es requerido'}` }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.debtorName })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} className={`p-inputtext-sm w-full ${classNames({ 'p-invalid': fieldState.error })}`} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>{`${debtTypeId === DebtTypeEnum.Entrante ? 'Nombre Deudor' : 'Nombre Acreedor'}`}</label>
                                    </span>
                                    {errors.debtorName && <small className="p-error">{`${debtTypeId === DebtTypeEnum.Entrante ? 'Nombre Deudor es requerido' : 'Nombre Acreedor es requerido'}`}</small>}
                                </>
                            )}
                        />
                    </div>

                    <div className='field flex flex-column col-12 md:col-6'>
                        <Controller
                            name="categoryId"
                            control={control}
                            rules={{ required: 'Categoría es requerida' }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.categoryId })}></label>
                                    <span className="p-float-label">
                                        <Dropdown appendTo='self' showClear value={field.value} onChange={(e) => {field.onChange(e.target.value); changeCategory()}} options={categoriesList} optionValue='categoryId' optionLabel="categoryDesc" className={`p-inputtext-sm w-full ${classNames({ 'p-invalid': fieldState.error })}`} />
                                        <label htmlFor={field.name}>Categoría</label>
                                    </span>
                                    {errors.categoryId && <small className="p-error">{errors.categoryId.message}</small>}
                                </>
                            )}
                        />
                    </div>
                    
                    <div className='field flex flex-column col-12 md:col-6'>
                        <Controller
                            name="subCategoryId"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <label htmlFor={field.name}></label>
                                    <span className="p-float-label">
                                        <Dropdown appendTo='self' showClear value={field.value} onChange={(e) => {field.onChange(e.target.value)}} options={subCategoriesFilterList} optionValue='subCategoryId' optionLabel="subCategoryDesc" className={`p-inputtext-sm w-full`} />
                                        <label htmlFor={field.name}>Subcategoría</label>
                                    </span>
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

export default DebtForm