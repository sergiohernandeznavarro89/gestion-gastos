import { FC, useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import * as MenuActions from "store/actions/MenuActions";

import { CategoryResponse } from 'models/category/CategoryResponse';
import { GetCategoriesByUser } from 'services/category/CategoryService';
import { ToastContainer, toast } from 'react-toastify';
import { SubCategoryResponse } from 'models/subCategory/SubCategoryResponse';
import { GetSubCategoriesByUser } from 'services/subCategory/SubCategoryService';
import CategoriesList from 'components/CategoriesList';
import SubCategoriesList from 'components/SubCategoriesList';


interface Props {
    userId: number
}

const Category: FC<Props> = ({ userId }) => {

    const dispatch = useDispatch();
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategoryResponse[]>([]);
    const [subCategoriesSelected, setSubCategoriesSelected] = useState<SubCategoryResponse[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryResponse>();

    useEffect(() => {
        dispatch(MenuActions.SetMenu({
            menuId: 0,
        }) as any);
    }, [])

    useEffect(() => {
        if (userId) {
            (async () => {
                const [
                    categoriesResponse,
                    subCategoriesResponse
                ] = await Promise.all([
                    GetCategoriesByUser(userId),
                    GetSubCategoriesByUser(userId)
                ]);
                
                setCategories(categoriesResponse);
                setSubCategories(subCategoriesResponse);

                if(categoriesResponse.length > 0){
                    setSelectedCategory(categoriesResponse[0]);
                    const currentSubCategories = subCategoriesResponse.filter(x => x.categoryId === categoriesResponse[0].categoryId);
                    setSubCategoriesSelected(currentSubCategories);
                }
            })();
        }
    }, [userId, refresh]);

    const displayToast = (message: string, severity: string) => {
        if (severity === 'success') {
            toast.success(message);
            setRefresh(!refresh);
        }
        else {
            toast.error(message);
        }
    }

    const clickCategory = (category: CategoryResponse) => {
        setSelectedCategory(category);
        const currentSubCategories = subCategories.filter(x => x.categoryId === category.categoryId);
        setSubCategoriesSelected(currentSubCategories);
    }

    return (
        <>
            <div className='flex flex-column w-12' style={{marginTop:'80px'}}>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />

                <CategoriesList
                    categories={categories}
                    clickCategory={clickCategory}
                    refresh={() => setRefresh(!refresh)} 
                    selectedCategory={selectedCategory}
                    displayToast={displayToast}
                />

                <SubCategoriesList
                    subCategoriesSelected={subCategoriesSelected}
                    refresh={() => setRefresh(!refresh)}
                    selectedCategory={selectedCategory}
                    displayToast={displayToast}
                />

            </div>                    
        </>
    )
}

export default Category