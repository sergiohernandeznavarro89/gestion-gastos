import { FC, useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { useSelector } from 'react-redux';
import { Text } from '@nextui-org/react';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { ButtonTag, ButtonTagSelected } from '../PaymentForm/styled';
import { InputNumber } from 'primereact/inputnumber';
import { PeriodTypeEnum } from 'enums/PeriodTypeEnum';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { CategoryResponse } from 'models/category/CategoryResponse';
import { SubCategoryResponse } from 'models/subCategory/SubCategoryResponse';
import { GetCategoriesByUser } from 'services/category/CategoryService';
import { GetSubCategoriesByUser } from 'services/subCategory/SubCategoryService';
import { AddTransfer, UpdateTransfer } from 'services/transfer/TransferService';
import moment from 'moment'
import 'moment/locale/es';
import { TransferResponse } from 'models/transfer/TransferResponse';
import { ResponseBase } from 'models/shared/ResponseBase';
import { GetAccountsByUser } from 'services/account/AccountService';
import { AccountResponse } from 'models/account/AccountResponse';

interface Props {
    cancelClick: () => void;
    displayToast: (message: string, severity: string) => void;
    transfer?: TransferResponse;
};

const TransferForm: FC<Props> = ({ cancelClick, displayToast, transfer }) => {
    const user = useSelector((state: any) => state.userState);
    const [periodTypeId, setPeriodTypeId] = useState<number>(transfer ? transfer.periodTypeId : PeriodTypeEnum.Exporadico);
    const [categoriesList, setCategoriesList] = useState<CategoryResponse[]>([]);
    const [subCategoriesList, setSubCategoriesList] = useState<SubCategoryResponse[]>([]);
    const [subCategoriesFilterList, setSubCategoriesFilterList] = useState<SubCategoryResponse[]>([]);
    const [accountsList, setAccountsList] = useState<AccountResponse[]>([]);
    const isMobile = window.matchMedia('(max-width: 768px)').matches;    

    useEffect(() => {
        if(transfer?.categoryId && subCategoriesList.length > 0){
            changeCategory();
        }
    }, [transfer, subCategoriesList])
    
    useEffect(() => {
        if (user.userId) {            
            (async () => {
                const [
                    categoriesResponse,
                    subCategoriesResponse,
                    accountsResponse
                ] = await Promise.all([
                    GetCategoriesByUser(user.userId),
                    GetSubCategoriesByUser(user.userId),
                    GetAccountsByUser(user.userId)
                ]);
                
                setCategoriesList(categoriesResponse);
                setSubCategoriesList(subCategoriesResponse);
                setAccountsList(accountsResponse);                           
            })();
        }
    }, [user.userId]);
    
    const defaultValues = {        
        transferName: transfer?.transferName ? transfer.transferName : '',
        transferDesc: transfer?.transferDesc ? transfer.transferDesc : '',
        ammount: transfer?.ammount ? transfer.ammount.toString() : '',
        periodity: transfer?.periodity ? transfer.periodity : null,
        startDate: transfer?.startDate ? new Date(transfer.startDate) : null,
        endDate: transfer?.endDate ? new Date(transfer.endDate) : null,
        categoryId: transfer?.categoryId ? transfer.categoryId : null,
        subCategoryId: transfer?.subCategoryId ? transfer.subCategoryId : null,
        originAccountId: transfer?.originAccountId ? transfer.originAccountId : null,
        destinationAccountId: transfer?.destinationAccountId ? transfer.destinationAccountId : null
    };

    const {
        control,
        formState: { errors },
        handleSubmit,
        getValues,
        setError,
        clearErrors
    } = useForm({ defaultValues });
    
    const request = async (data: any): Promise<ResponseBase> => {
        const requestData = {            
            transferName: data.transferName,
            transferDesc: data.transferDesc,
            ammount: Number(data.ammount?.toString().replace(',', '.')) || 0,
            periodity: data.periodity ? Number(data.periodity) : null,
            startDate: data.startDate ? moment(data.startDate).format('YYYY-MM-DDTHH:mm:ss') : moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
            endDate: data.endDate ? moment(data.endDate).format('YYYY-MM-DDTHH:mm:ss') : moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
            categoryId: data.categoryId,
            subCategoryId: data.subCategoryId || null,
            originAccountId: data.originAccountId,
            destinationAccountId: data.destinationAccountId
        }

        if(!transfer?.transferId){
            var postData = {...requestData, ...{periodTypeId: periodTypeId, userId: user.userId}};
            const response = await AddTransfer(postData as any);
            return response;
        }
        else{
            var putData = {...requestData, ...{periodTypeId: periodTypeId, transferId: transfer.transferId, userId: user.userId}};
            const response = await UpdateTransfer(putData as any);
            return response;
        }
    }

    const onSubmit = async (data: any) => {        
        if (data.originAccountId === data.destinationAccountId) {
            setError("destinationAccountId", { type: "manual", message: "La cuenta de destino no puede ser igual a la cuenta origen" });
            return;
        }
        
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
                    {!transfer?.transferId && <div className={`flex flex-column gap-2 w-12 md:w-6 ${!isMobile && 'align-items-center'}`}>
                        <Text h6 className='m-0' color='primary'>Tipo de transferencia</Text>
                        <div className='flex gap-2 flex-wrap'>
                            {periodTypeId === PeriodTypeEnum.Exporadico ? 
                                <ButtonTagSelected label='Exporádico' rounded type='button'/> : 
                                <ButtonTag label='Exporádico' rounded onClick={() => {setPeriodTypeId(PeriodTypeEnum.Exporadico);}} type='button'/>}
                            {periodTypeId === PeriodTypeEnum.Recurrente ? <ButtonTagSelected label='Recurrente' rounded type='button'/> : <ButtonTag label='Recurrente' rounded onClick={() => setPeriodTypeId(PeriodTypeEnum.Recurrente)} type='button'/>}
                        </div>
                    </div>}
                </div>
                <div className='formgrid grid'>
                    <div className='field flex flex-column col-12 md:col-6'>
                        <Controller                        
                            name="transferName"
                            control={control}
                            rules={{ required: 'Nombre es requerido' }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.transferName })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} className={`p-inputtext-sm w-full ${classNames({ 'p-invalid': fieldState.error })}`} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>Nombre</label>
                                    </span>
                                    {errors.transferName && <small className="p-error">{errors.transferName.message}</small>}
                                </>
                            )}
                        />
                    </div>

                    <div className='field flex flex-column col-12 md:col-6'>
                        <Controller
                            name="transferDesc"
                            control={control}                        
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.transferDesc })}></label>
                                    <span className="p-float-label">
                                        <InputText id={field.name} value={field.value} className={`p-inputtext-sm w-full`} onChange={(e) => field.onChange(e.target.value)} />
                                        <label htmlFor={field.name}>Descripción</label>
                                    </span>                                
                                </>
                            )}
                        />
                    </div>

                    <div className='field flex flex-column col-12 md:col-6'>
                        <Controller
                            name="ammount"
                            control={control}
                            rules={{ required: 'Cantidad es requerida' }}
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
                    
                    <div className='field flex flex-column col-12 md:col-6'>
                        <Controller
                            name="originAccountId"
                            control={control}
                            rules={{ required: 'Cuenta de origen es requerida' }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.originAccountId })}></label>
                                    <span className="p-float-label">
                                        <Dropdown 
                                            appendTo='self' 
                                            showClear 
                                            value={field.value} 
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                                clearErrors("destinationAccountId");
                                            }} 
                                            options={accountsList} 
                                            optionValue='accountId' 
                                            optionLabel="accountName" 
                                            className={`p-inputtext-sm w-full ${classNames({ 'p-invalid': fieldState.error })}`} 
                                            disabled={!!transfer?.transferId}
                                        />
                                        <label htmlFor={field.name}>Cuenta Origen</label>
                                    </span>
                                    {errors.originAccountId && <small className="p-error">{errors.originAccountId.message}</small>}
                                </>
                            )}
                        />
                    </div>

                    <div className='field flex flex-column col-12 md:col-6'>
                        <Controller
                            name="destinationAccountId"
                            control={control}
                            rules={{ required: 'Cuenta de destino es requerida' }}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.destinationAccountId })}></label>
                                    <span className="p-float-label">
                                        <Dropdown 
                                            appendTo='self' 
                                            showClear 
                                            value={field.value} 
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                                clearErrors("destinationAccountId");
                                            }} 
                                            options={accountsList} 
                                            optionValue='accountId' 
                                            optionLabel="accountName" 
                                            className={`p-inputtext-sm w-full ${classNames({ 'p-invalid': fieldState.error })}`} 
                                            disabled={!!transfer?.transferId}
                                        />
                                        <label htmlFor={field.name}>Cuenta Destino</label>
                                    </span>
                                    {errors.destinationAccountId && <small className="p-error">{errors.destinationAccountId.message}</small>}
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

export default TransferForm
