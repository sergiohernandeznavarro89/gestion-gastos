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

    return (
        <>            
            <div className='flex flex-column m-2'>
                <div className='flex flex-column gap-1'>
                    <div className='flex flex-row align-items-center gap-1'>
                        <Text h4 className='m-0' color='primary' >Subcategorías de {selectedCategory?.categoryDesc}</Text>
                        <div className='flex'>
                            <Button icon={<AddIcon />} className='p-0 pt-1' style={{ height: 'fit-content', width:'2rem' }} rounded link onClick={() => setShowDialogSubCategory(true)} />                            
                            <Button icon={<DeleteIcon />} className='p-0 pt-1' style={{ color:'red', height: 'fit-content', width:'2rem' }} rounded link />
                            <Button icon={<EditIcon />} className='p-0 pt-1' style={{ height: 'fit-content', width:'2rem' }} rounded link onClick={() => {setShowDialogSubCategory(true); setSubCategoryEdit(selectedSubCategory)}} />

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

            <Dialog header={!subCategoryEdit ? `Nueva Subcategoría de ${selectedCategory?.categoryDesc}` : `Editar Subcategoría de ${selectedCategory?.categoryDesc}`} maximizable visible={showDialogSubCategory} style={{ width: '95%' }} onHide={() => {setShowDialogSubCategory(false); setSubCategoryEdit(undefined)}}>
                <SubCategoryForm cancelClick={() => {setShowDialogSubCategory(false); setSubCategoryEdit(undefined)}} displayToast={displayToast} selectedCategory={selectedCategory} subCategory={subCategoryEdit} />            
            </Dialog>              
        </>
    )
}

export default SubCategoriesList