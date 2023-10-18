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

interface Props {
    categories: CategoryResponse[];
    clickCategory: (category: CategoryResponse) => void;
    selectedCategory: CategoryResponse | undefined;
    displayToast: (message: string, severity: string) => void;
};

const CategoriesList: FC<Props> = ({ categories, clickCategory, selectedCategory, displayToast }) => {

    const [showDialogCategory, setShowDialogCategory] = useState<boolean>(false);    
    const [categoryEdit, setCategoryEdit] = useState<CategoryResponse>();
    const isMobile = window.matchMedia('(max-width: 768px)').matches;    

    return (
        <>            
            <div className='flex flex-column m-2'>
                <div className='flex flex-column gap-1'>
                    <div className='flex flex-row align-items-center gap-2'>
                        <Text h4 className='m-0' color='primary' >Categorías</Text>
                        <div className='flex'>
                            <Button icon={<AddIcon />} className='p-0 pt-1' style={{ height: 'fit-content', width:'2rem' }} rounded link onClick={() => setShowDialogCategory(true)} />
                            <Button icon={<DeleteIcon />} className='p-0 pt-1' style={{ color:'red', height: 'fit-content', width:'2rem' }} rounded link />
                            <Button icon={<EditIcon />} className='p-0 pt-1' style={{ height: 'fit-content', width:'2rem' }} rounded link onClick={() => {setShowDialogCategory(true); setCategoryEdit(selectedCategory)}} />

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
        </>
    )
}

export default CategoriesList