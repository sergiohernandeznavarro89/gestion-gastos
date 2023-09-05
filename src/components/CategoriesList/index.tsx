import { FC, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';

import { Button } from 'primereact/button';
import { CategoryResponse } from 'models/category/CategoryResponse';
import { Text } from '@nextui-org/react';
import { ButtonTag, ButtonTagSelected } from './styled';
import NewCategoryForm from 'components/NewCategoryForm';
import { Dialog } from 'primereact/dialog';


interface Props {
    categories: CategoryResponse[];
    clickCategory: (category: CategoryResponse) => void;
    refresh: () => void;
    selectedCategory: CategoryResponse | undefined;
    displayToast: (message: string, severity: string) => void;
};

const CategoriesList: FC<Props> = ({ categories, refresh, clickCategory, selectedCategory, displayToast }) => {

    const [showDialogNewCategory, setShowDialogNewCategory] = useState<boolean>(false);    

    return (
        <>            
            <div className='flex flex-column m-2'>
                <div className='flex flex-column gap-1'>
                    <div className='flex flex-row align-items-center gap-1'>
                        <Text h4 className='m-0' color='primary' >Categorías</Text>
                        <Button icon={<AddIcon />} className='p-0 pt-1' style={{ height: 'fit-content' }} rounded text onClick={() => setShowDialogNewCategory(true)} />
                    </div>
                </div>

                <div className='flex gap-2 mt-2 w-12 flex-wrap'>
                    {categories.length > 0 ? categories.map((item) =>                    
                        item === selectedCategory ? 
                            <ButtonTagSelected label={item.categoryDesc} rounded onClick={(e) => clickCategory(item)}/> 
                            : <ButtonTag label={item.categoryDesc} rounded onClick={(e) => clickCategory(item)}/>                        
                    ) : (
                        <ButtonTag label="no existen categorías que mostrar" rounded />                    
                    )}
                </div>
            </div>

            <Dialog header="Nueva Categoría" maximizable visible={showDialogNewCategory} style={{ width: '95%' }} onHide={() => setShowDialogNewCategory(false)}>
                <NewCategoryForm cancelClick={() => setShowDialogNewCategory(false)} displayToast={displayToast} />
            </Dialog>                 
        </>
    )
}

export default CategoriesList