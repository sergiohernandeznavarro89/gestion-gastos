import { FC, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Button } from 'primereact/button';
import { SubCategoryResponse } from 'models/subCategory/SubCategoryResponse';
import { CategoryResponse } from 'models/category/CategoryResponse';
import { Text } from '@nextui-org/react';
import { ButtonTag, ButtonTagSelected } from './styled';
import { Dialog } from 'primereact/dialog';
import EditIcon from '@mui/icons-material/CreateOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SubCategoryForm from 'components/SubCategoryForm';

import { DeleteSubCategory } from 'services/subCategory/SubCategoryService';

interface Props {
    subCategoriesList: SubCategoryResponse[];    
    selectedCategory: CategoryResponse | undefined;
    selectedSubCategory: SubCategoryResponse | undefined;
    displayToast: (message: string, severity: string) => void;
    clickSubCategory: (subCategory: SubCategoryResponse) => void;
};

const SubCategoriesList: FC<Props> = ({ subCategoriesList, selectedCategory, displayToast, selectedSubCategory, clickSubCategory }) => {

    const [showDialogSubCategory, setShowDialogSubCategory] = useState<boolean>(false);
    const [subCategoryEdit, setSubCategoryEdit] = useState<SubCategoryResponse>();
    const [showDeleteDialogSubCategory, setShowDeleteDialogSubCategory] = useState<boolean>(false);
    const isMobile = window.matchMedia('(max-width: 768px)').matches;    

    const handleDeleteClick = () => {
        setShowDeleteDialogSubCategory(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedSubCategory) return;
        try {
            const response = await DeleteSubCategory(selectedSubCategory.subCategoryId);
            if (response.success) {
                displayToast(response.message, 'success');
            } else {
                displayToast(response.message, 'error');
            }
        } catch (error: any) {
            displayToast("Ocurrió un error al borrar la subcategoría", 'error');
        } finally {
            setShowDeleteDialogSubCategory(false);
        }
    };

    return (
        <>            
            <div className='flex flex-column m-2'>
                <div className='flex flex-column gap-1'>
                    <div className='flex flex-row align-items-center gap-1'>
                        <Text h4 className='m-0' color='primary' >Subcategorías de {selectedCategory?.categoryDesc}</Text>
                        <div className='flex'>
                            <Button icon={<AddIcon />} className='p-0 pt-1' style={{ height: 'fit-content', width:'2rem' }} rounded link onClick={() => setShowDialogSubCategory(true)} />                            
                            <Button disabled={!selectedSubCategory} icon={<DeleteIcon />} className='p-0 pt-1' style={{ color:'red', height: 'fit-content', width:'2rem' }} rounded link onClick={handleDeleteClick} />
                            <Button disabled={!selectedSubCategory} icon={<EditIcon />} className='p-0 pt-1' style={{ height: 'fit-content', width:'2rem' }} rounded link onClick={() => {setShowDialogSubCategory(true); setSubCategoryEdit(selectedSubCategory)}} />

                        </div>
                    </div>
                </div>

                <div className='flex gap-2 mt-2 w-12 flex-wrap'>
                    {subCategoriesList.length > 0 ? subCategoriesList.map((item) =>
                        item === selectedSubCategory ? 
                            <ButtonTagSelected key={item.subCategoryId} label={item.subCategoryDesc} rounded onClick={(e) => clickSubCategory(item)}/> 
                            : <ButtonTag key={item.subCategoryId} label={item.subCategoryDesc} rounded onClick={(e) => clickSubCategory(item)}/> 
                    ) : (                        
                        <ButtonTag label='no existen subcategorías que mostrar' rounded />                            
                    )}
                </div>
            </div>

            <Dialog 
                position="center" 
                style={ isMobile ? { width: '95%' } : {width:'30%'}} 
                header={!subCategoryEdit ? `Nueva Subcategoría de ${selectedCategory?.categoryDesc}` : `Editar Subcategoría de ${selectedCategory?.categoryDesc}`} 
                maximizable 
                visible={showDialogSubCategory} 
                onHide={() => {setShowDialogSubCategory(false); setSubCategoryEdit(undefined)}}
            >
                <SubCategoryForm cancelClick={() => {setShowDialogSubCategory(false); setSubCategoryEdit(undefined)}} displayToast={displayToast} selectedCategory={selectedCategory} subCategory={subCategoryEdit} />            
            </Dialog>              

            <Dialog 
                position="center" 
                style={ isMobile ? { width: '95%' } : {width:'30%'}} 
                header="Confirmar Borrado"
                maximizable={false}
                visible={showDeleteDialogSubCategory} 
                onHide={() => setShowDeleteDialogSubCategory(false)}
            >
                <div className="flex flex-column gap-3">
                    <Text>¿Estás seguro de que quieres borrar esta subcategoría?</Text>
                    <div className="flex justify-content-end gap-2">
                        <Button label="Cancelar" icon="pi pi-times" onClick={() => setShowDeleteDialogSubCategory(false)} className="p-button-text" />
                        <Button label="Borrar" icon="pi pi-check" onClick={handleDeleteConfirm} autoFocus severity="danger" />
                    </div>
                </div>
            </Dialog> 
        </>
    )
}

export default SubCategoriesList