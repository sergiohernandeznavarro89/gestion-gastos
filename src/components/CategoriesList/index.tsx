import { FC, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Button } from 'primereact/button';
import { CategoryResponse } from 'models/category/CategoryResponse';
import { Text } from '@nextui-org/react';
import { ButtonTag, ButtonTagSelected } from './styled';
import { Dialog } from 'primereact/dialog';
import EditIcon from '@mui/icons-material/CreateOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import CategoryForm from 'components/CategoryForm';

import { DeleteCategory } from 'services/category/CategoryService';

interface Props {
    categories: CategoryResponse[];
    clickCategory: (category: CategoryResponse) => void;
    selectedCategory: CategoryResponse | undefined;
    displayToast: (message: string, severity: string) => void;
};

const CategoriesList: FC<Props> = ({ categories, clickCategory, selectedCategory, displayToast }) => {

    const [showDialogCategory, setShowDialogCategory] = useState<boolean>(false);    
    const [categoryEdit, setCategoryEdit] = useState<CategoryResponse>();
    const [showDeleteDialogCategory, setShowDeleteDialogCategory] = useState<boolean>(false);
    const isMobile = window.matchMedia('(max-width: 768px)').matches;    

    const handleDeleteClick = () => {
        setShowDeleteDialogCategory(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedCategory) return;
        try {
            const response = await DeleteCategory(selectedCategory.categoryId);
            if (response.success) {
                displayToast(response.message, 'success');
            } else {
                displayToast(response.message, 'error');
            }
        } catch (error: any) {
            displayToast("Ocurrió un error al borrar la categoría", 'error');
        } finally {
            setShowDeleteDialogCategory(false);
        }
    };

    return (
        <>            
            <div className='flex flex-column m-2'>
                <div className='flex flex-column gap-1'>
                    <div className='flex flex-row align-items-center gap-2'>
                        <Text h4 className='m-0' color='primary' >Categorías</Text>
                        <div className='flex'>
                            <Button icon={<AddIcon />} className='p-0 pt-1' style={{ height: 'fit-content', width:'2rem' }} rounded link onClick={() => setShowDialogCategory(true)} />
                            <Button disabled={!selectedCategory} icon={<DeleteIcon />} className='p-0 pt-1' style={{ color:'red', height: 'fit-content', width:'2rem' }} rounded link onClick={handleDeleteClick} />
                            <Button disabled={!selectedCategory} icon={<EditIcon />} className='p-0 pt-1' style={{ height: 'fit-content', width:'2rem' }} rounded link onClick={() => {setShowDialogCategory(true); setCategoryEdit(selectedCategory)}} />

                        </div>
                    </div>
                </div>

                <div className='flex gap-2 mt-2 w-12 flex-wrap'>
                    {categories.length > 0 ? categories.map((item) =>                    
                        item === selectedCategory ? 
                            <ButtonTagSelected key={item.categoryId} label={item.categoryDesc} rounded onClick={(e) => clickCategory(item)}/> 
                            : <ButtonTag key={item.categoryId} label={item.categoryDesc} rounded onClick={(e) => clickCategory(item)}/>                        
                    ) : (
                        <ButtonTag label="no existen categorías que mostrar" rounded />                    
                    )}
                </div>
            </div>

            <Dialog 
                position="center" 
                style={ isMobile ? { width: '95%' } : {width:'30%'}} 
                header={!categoryEdit ? "Nueva Categoría" : "Editar Categoría"} 
                maximizable 
                visible={showDialogCategory}                 
                onHide={() => {setShowDialogCategory(false); 
                    setCategoryEdit(undefined)}}
            >
                <CategoryForm cancelClick={() => {setShowDialogCategory(false); setCategoryEdit(undefined)}} displayToast={displayToast} category={categoryEdit}/>
            </Dialog>                 

            <Dialog 
                position="center" 
                style={ isMobile ? { width: '95%' } : {width:'30%'}} 
                header="Confirmar Borrado"
                maximizable={false}
                visible={showDeleteDialogCategory} 
                onHide={() => setShowDeleteDialogCategory(false)}
            >
                <div className="flex flex-column gap-3">
                    <Text>¿Estás seguro de que quieres borrar esta categoría?</Text>
                    <div className="flex justify-content-end gap-2">
                        <Button label="Cancelar" icon="pi pi-times" onClick={() => setShowDeleteDialogCategory(false)} className="p-button-text" />
                        <Button label="Borrar" icon="pi pi-check" onClick={handleDeleteConfirm} autoFocus severity="danger" />
                    </div>
                </div>
            </Dialog> 
        </>
    )
}

export default CategoriesList