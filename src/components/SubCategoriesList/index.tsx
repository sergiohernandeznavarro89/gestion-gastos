import { FC, useState } from 'react';
import { Card } from '@nextui-org/react';
import AddIcon from '@mui/icons-material/Add';
import { Button } from 'primereact/button';
import { SubCategoryResponse } from 'models/subCategory/SubCategoryResponse';
import { CategoryResponse } from 'models/category/CategoryResponse';
import { Text } from '@nextui-org/react';
import Modal from '@mui/joy/Modal';
import { ModalClose } from '@mui/joy';
import { StyledModalDialog } from './styled';
import NewSubCategoryForm from 'components/NewSubCategoryForm';


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
                        <Card                                                                    
                            className='p-2'
                            key={item.subCategoryDesc}
                            variant="bordered"
                            style={{width:'fit-content', cursor:'pointer'}}
                        >
                            {item.subCategoryDesc}                                
                        </Card>
                    ) : (
                        <Card
                            isPressable 
                            className='p-2'                                    
                            variant="bordered"
                            style={{width:'fit-content', cursor:'pointer'}}
                        >
                            no existen subcategorías que mostrar
                        </Card>
                    )}
                </div>
            </div>

            <Modal
                open={showDialogNewSubCategory}
                onClose={() => setShowDialogNewSubCategory(false)}
            >
                <StyledModalDialog
                    aria-labelledby="basic-modal-dialog-title"
                    aria-describedby="basic-modal-dialog-description"
                    variant='outlined'
                >
                    <div className='flex flex-column gap-3'>
                        <div className='flex flex-row justify-content-between'>
                            <ModalClose className="pt-2" />
                            <Text h4 color='primary'>Nueva Subcategoría de {selectedCategory?.categoryDesc}</Text>
                        </div>
                        <div>
                            <NewSubCategoryForm cancelClick={() => setShowDialogNewSubCategory(false)} displayToast={displayToast} selectedCategory={selectedCategory} />
                        </div>
                    </div>
                </StyledModalDialog>
            </Modal>
        </>
    )
}

export default SubCategoriesList