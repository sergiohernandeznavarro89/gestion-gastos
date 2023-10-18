
import { FC, useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { useSelector } from 'react-redux';
import { Text } from '@nextui-org/react';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { ButtonTag, ButtonTagSelected } from './styled';
import { InputNumber } from 'primereact/inputnumber';
import { AmmountTypeEnum } from 'enums/AmmountTypeEnum';
import { PeriodTypeEnum } from 'enums/PeriodTypeEnum';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { CategoryResponse } from 'models/category/CategoryResponse';
import { SubCategoryResponse } from 'models/subCategory/SubCategoryResponse';
import { GetCategoriesByUser } from 'services/category/CategoryService';
import { GetSubCategoriesByUser } from 'services/subCategory/SubCategoryService';
import { ItemTypeEnum } from 'enums/ItemTypeEnum';
import { AddItem, UpdateItem } from 'services/item/ItemService';
import moment from 'moment'
import 'moment/locale/es';
import { ItemResponse } from 'models/item/ItemResponse';
import { ResponseBase } from 'models/shared/ResponseBase';

interface Props {
    cancelClick: () => void;
    displayToast: (message: string, severity: string) => void;
    itemType: number | undefined;
    item?: ItemResponse;
    accountId: number | undefined;
};

const PaymentForm: FC<Props> = ({ cancelClick, displayToast, itemType, item, accountId }) => {
    const user = useSelector((state: any) => state.userState);
    const [periodTypeId, setPeriodTypeId] = useState<number>(item ? PeriodTypeEnum.Recurrente : PeriodTypeEnum.Exporadico);
    const [ammountTypeId, setAmmountTypeId] = useState<number>(item ? item.ammountTypeId : AmmountTypeEnum.Fijo);
    const [categoriesList, setCategoriesList] = useState<CategoryResponse[]>([]);
    const [subCategoriesList, setSubCategoriesList] = useState<SubCategoryResponse[]>([]);
    const [subCategoriesFilterList, setSubCategoriesFilterList] = useState<SubCategoryResponse[]>([]);
    const isMobile = window.matchMedia('(max-width: 768px)').matches;    

    useEffect(() => {
        if(item?.categoryId && subCategoriesList.length > 0){
            changeCategory();
        }
    }, [item, subCategoriesList])
    

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
        itemName: item ? item.itemName : '',
        itemDesc: item ? item.itemDesc : '',
        ammount: item ? item.ammount.toString() : '',
        periodity: item ? item.periodity : null,
        startDate: item ? new Date(item.startDate) : null,
        endDate: item ? new Date(item.endDate) : null,
        categoryId: item ? item.categoryId : null,
        subCategoryId: item ? item.subCategoryId : null,
        accountId: item ? item.accountId : accountId
    };

    const {
        control,
        formState: { errors },
        handleSubmit,
        getValues,
    } = useForm({ defaultValues });
    
    const request = async (data: any): Promise<ResponseBase> => {
        const requestData = {            
            itemName: data.itemName,
            itemDesc: data.itemDesc,
            ammount: ammountTypeId === AmmountTypeEnum.Variable ? 0 : data.ammount || 0,
            periodity: data.periodity,
            startDate: data.startDate ? moment(data.startDate).format('YYYY-MM-DD HH:mm:ss') : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            endDate: data.endDate ? moment(data.endDate).format('YYYY-MM-DD HH:mm:ss') : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            cancelled: false,
            categoryId: data.categoryId,
            subCategoryId: data.subCategoryId,
            itemTypeId: itemType || ItemTypeEnum.Gasto,
            ammountTypeId: periodTypeId === PeriodTypeEnum.Exporadico ? AmmountTypeEnum.Fijo : ammountTypeId,
            accountId: data.accountId
        }

        if(!item){
            var postData = {...requestData, ...{periodTypeId: periodTypeId, userId: user.userId}};
            const response = await AddItem(postData);
            return response;
        }
        else{
            var putData = {...requestData, ...{itemId: item.itemId}};
            const response = await UpdateItem(putData);
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
                <div className={`flex ${isMobile ? 'flex-column gap-2' : 'flex-row mb-3'}`}>
                    {!item && <div className={`flex flex-column gap-2 w-12 md:w-6 ${!isMobile && 'align-items-center'}`}>
                        <Text h6 className='m-0' color='primary'>Tipo de cobro</Text>
                        <div className='flex gap-2 flex-wrap'>
                            {periodTypeId === PeriodTypeEnum.Exporadico ? 
                                <ButtonTagSelected label='Exporádico' rounded type='button'/> : 
                                <ButtonTag label='Exporádico' rounded onClick={() => {setPeriodTypeId(PeriodTypeEnum.Exporadico); setAmmountTypeId(AmmountTypeEnum.Fijo)}} type='button'/>}
                            {periodTypeId === PeriodTypeEnum.Recurrente ? <ButtonTagSelected label='Recurrente' rounded type='button'/> : <ButtonTag label='Recurrente' rounded onClick={() => setPeriodTypeId(PeriodTypeEnum.Recurrente)} type='button'/>}
                        </div>
                    </div>}

                    {periodTypeId === PeriodTypeEnum.Recurrente && <div className={`flex flex-column gap-2 w-12 md:w-6 ${!isMobile && !item && 'align-items-center'}`}>
                        <Text h6 className='m-0' color='primary'>Tipo de pago</Text>
                        <div className='flex gap-2 flex-wrap'>
                            {ammountTypeId === AmmountTypeEnum.Fijo ? <ButtonTagSelected label='Fijo' rounded type='button'/> : <ButtonTag label='Fijo' rounded onClick={() => setAmmountTypeId(AmmountTypeEnum.Fijo)} type='button'/>}
                            {ammountTypeId === AmmountTypeEnum.Variable ? <ButtonTagSelected label='Variable' rounded type='button'/> : <ButtonTag label='Variable' rounded onClick={() => setAmmountTypeId(AmmountTypeEnum.Variable)} type='button'/>}
                        </div>
                    </div>}                        
                </div>
                <div className='formgrid grid'>
                    <div className='field flex flex-column col-12 md:col-6'>
                        <Controller                        
                            name="itemName"
                            control={control}
                            rules={{ required: 'Nombre es requerido' }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.itemName })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} className={`p-inputtext-sm w-full ${classNames({ 'p-invalid': fieldState.error })}`} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>Nombre</label>
                                    </span>
                                    {errors.itemName && <small className="p-error">{errors.itemName.message}</small>}
                                </>
                            )}
                        />
                    </div>

                    <div className='field flex flex-column col-12 md:col-6'>
                        <Controller
                            name="itemDesc"
                            control={control}                        
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.itemDesc })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} className={`p-inputtext-sm w-full`} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>Descripción</label>
                                    </span>                                
                                </>
                            )}
                        />
                    </div>

                    {((periodTypeId === PeriodTypeEnum.Exporadico) || (periodTypeId === PeriodTypeEnum.Recurrente && ammountTypeId === AmmountTypeEnum.Fijo )) && 
                        <div className='field flex flex-column col-12 md:col-6'>
                            <Controller
                                name="ammount"
                                control={control}
                                rules={{ required: ammountTypeId === AmmountTypeEnum.Fijo && 'Cantidad es requerido' }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.ammount })}></label>
                                        <span className="p-float-label">
                                            <InputText prefix=' €' id={field.name} value={field.value} className={`p-inputtext-sm w-full`} onChange={(e) => field.onChange(e.target.value)} />                                        
                                            <label htmlFor={field.name}>Cantidad</label>
                                        </span>
                                        {errors.ammount && <small className="p-error">{errors.ammount.message}</small>}
                                    </>
                                )}
                            />     
                        </div>
                    }             
                    
                    {periodTypeId === PeriodTypeEnum.Recurrente && 
                        <>
                            <div className='field flex flex-column col-12 md:col-6'>
                                <Controller
                                    name="periodity"
                                    control={control}
                                    rules={{ required: periodTypeId === PeriodTypeEnum.Recurrente && 'Periodo es requerido' }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <label htmlFor={field.name} className={classNames({ 'p-error': errors.periodity })}></label>
                                            <span className="p-float-label">
                                                <InputNumber suffix=' Meses' id={field.name} value={field.value} className={`p-inputtext-sm w-full ${classNames({ 'p-invalid': fieldState.error })}`} onChange={(e) => field.onChange(e.value)} />
                                                <label htmlFor={field.name}>Periodo</label>
                                            </span>
                                            {errors.periodity && <small className="p-error">{errors.periodity.message}</small>}
                                        </>
                                    )}
                                />     
                            </div>

                            <div className='field flex flex-column col-12 md:col-6'>
                                <Controller
                                    name="startDate"
                                    control={control}
                                    rules={{ required: periodTypeId === PeriodTypeEnum.Recurrente && 'Fecha inicio es requerida' }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <label htmlFor={field.name} className={classNames({ 'p-error': errors.startDate })}></label>
                                            <span className="p-float-label">
                                                <Calendar showButtonBar  dateFormat="dd/mm/yy" id={field.name} value={field.value} className={`p-inputtext-sm w-full ${classNames({ 'p-invalid': fieldState.error })}`} onChange={(e) => field.onChange(e.target.value)} showIcon />
                                                <label htmlFor={field.name}>Fecha inicio</label>
                                            </span>
                                            {errors.startDate && <small className="p-error">{errors.startDate.message}</small>}
                                        </>
                                    )}
                                />     
                            </div>   

                            <div className='field flex flex-column col-12 md:col-6'>
                                <Controller
                                    name="endDate"
                                    control={control}
                                    rules={{ required: periodTypeId === PeriodTypeEnum.Recurrente && 'Fecha fin es requerida' }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <label htmlFor={field.name} className={classNames({ 'p-error': errors.endDate })}></label>
                                            <span className="p-float-label">
                                                <Calendar showButtonBar  dateFormat="dd/mm/yy" id={field.name} value={field.value} className={`p-inputtext-sm w-full ${classNames({ 'p-invalid': fieldState.error })}`} onChange={(e) => field.onChange(e.target.value)} showIcon />
                                                <label htmlFor={field.name}>Fecha fin</label>
                                            </span>
                                            {errors.endDate && <small className="p-error">{errors.endDate.message}</small>}
                                        </>
                                    )}
                                />     
                            </div>                        
                        </>
                    }

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
                    
                    {item && <div className='field flex flex-column col-12 md:col-6'>
                        <Controller
                            name="accountId"
                            control={control}
                            rules={{ required: 'Cuenta es requerida' }}
                            render={({ field, fieldState }
                                ) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.accountId })}></label>
                                    <span className="p-float-label">
                                        <InputText disabled id={field.name} value={item?.accountName} className={`p-inputtext-sm w-full`} />                                        
                                        <label htmlFor={field.name}>Cuenta</label>
                                    </span>
                                    {errors.accountId && <small className="p-error">{errors.accountId.message}</small>}
                                </>
                            )}
                        />
                    </div>}
                </div>
                <div className='flex justify-content-end gap-2'>
                    <Button label="Cancelar" type='button' onClick={cancelClick} severity='danger' raised text size='small' />
                    <Button label="Guardar" severity='info' raised size='small' />
                </div>
            </form>
        </>
    )
}

export default PaymentForm