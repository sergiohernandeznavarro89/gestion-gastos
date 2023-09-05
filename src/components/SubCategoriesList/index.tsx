import { FC, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Button } from 'primereact/button';
import { SubCategoryResponse } from 'models/subCategory/SubCategoryResponse';
import { CategoryResponse } from 'models/category/CategoryResponse';
import { Text } from '@nextui-org/react';
import { ButtonTag } from './styled';
import NewSubCategoryForm from 'components/NewSubCategoryForm';
import { Dialog } from 'primereact/dialog';


interface Props {
    subCategoriesSelected: SubCategoryResponse[];    
    refresh: () => void;
    selectedCategory: CategoryResponse | undefined;
    displayToast: (message: string, severity: string) => void;
};

const SubCategoriesList: FC<Props> = ({ subCategoriesSelected, refresh, selectedCategory, displayToast }) => {

    const [showDialogNewSubCategory, setShowDialogNewSubCategory] = useState<boolean>(false);

    return (
        <>            
            <div className='flex flex-column m-2'>
                <div className='flex flex-column gap-1'>
                    <div className='flex flex-row align-items-center gap-1'>
                        <Text h4 className='m-0' color='primary' >Subcategorías de {selectedCategory?.categoryDesc}</Text>
                        <Button icon={<AddIcon />} className='p-0 pt-1' style={{ height: 'fit-content' }} rounded text onClick={() => setShowDialogNewSubCategory(true)} />
                    </div>
                </div>

                <div className='flex gap-2 mt-2 w-12 flex-wrap'>
                    {subCategoriesSelected.length > 0 ? subCategoriesSelected.map((item) =>
                        <ButtonTag label={item.subCategoryDesc} rounded />                                              
                    ) : (                        
                        <ButtonTag label='no existen subcategorías que mostrar' rounded />                            
                    )}
                </div>
            </div>

            <Dialog header={`Nueva Subcategoría de ${selectedCategory?.categoryDesc}`} maximizable visible={showDialogNewSubCategory} style={{ width: '95%' }} onHide={() => setShowDialogNewSubCategory(false)}>
                <NewSubCategoryForm cancelClick={() => setShowDialogNewSubCategory(false)} displayToast={displayToast} selectedCategory={selectedCategory} />            
            </Dialog>              
        </>
    )
}

export default SubCategoriesList