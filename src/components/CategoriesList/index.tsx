import { FC, useState } from 'react';
import { Card } from '@nextui-org/react';
import AddIcon from '@mui/icons-material/Add';

import { Button } from 'primereact/button';
import { CategoryResponse } from 'models/category/CategoryResponse';
import { Text } from '@nextui-org/react';
import Modal from '@mui/joy/Modal';
import { ModalClose } from '@mui/joy';
import { StyledModalDialog, ButtonTag, ButtonTagSelected } from './styled';
import NewCategoryForm from 'components/NewCategoryForm';


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

            <Modal
                open={showDialogNewCategory}
                onClose={() => setShowDialogNewCategory(false)}
            >
                <StyledModalDialog
                    aria-labelledby="basic-modal-dialog-title"
                    aria-describedby="basic-modal-dialog-description"
                    variant='outlined'
                >
                    <div className='flex flex-column gap-3'>
                        <div className='flex flex-row justify-content-between'>
                            <ModalClose className="pt-2" />
                            <Text h4 color='primary'>Nueva Categoría</Text>
                        </div>
                        <div>
                            <NewCategoryForm cancelClick={() => setShowDialogNewCategory(false)} displayToast={displayToast} />
                        </div>
                    </div>
                </StyledModalDialog>
            </Modal>
        </>
    )
}

export default CategoriesList