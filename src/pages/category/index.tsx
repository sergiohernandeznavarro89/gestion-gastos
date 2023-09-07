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
import Spinner from 'components/Spinner';


interface Props {
    userId: number
}

const Category: FC<Props> = ({ userId }) => {

    const dispatch = useDispatch();
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategoryResponse[]>([]);
    const [subCategoriesFiltered, setSubCategoriesFiltered] = useState<SubCategoryResponse[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryResponse>();
    const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryResponse>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        dispatch(MenuActions.SetMenu({
            menuId: 3,
        }) as any);
    }, [])

    useEffect(() => {
        if (userId) {
            setLoading(true);
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
                    setSubCategoriesFiltered(currentSubCategories);
                }                
                setLoading(false);
            })();
        }
    }, [userId, refresh]);

    useEffect(() => {
        if(subCategoriesFiltered.length > 0){
            setSelectedSubCategory(subCategoriesFiltered[0]);                    
        }
    }, [subCategoriesFiltered])
    

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
        setSubCategoriesFiltered(currentSubCategories);
    }
    
    const clickSubCategory = (subCategory: SubCategoryResponse) => {
        setSelectedSubCategory(subCategory);
    }

    return (
        <>
            {loading && <Spinner loading={loading}/>}

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
                    selectedCategory={selectedCategory}
                    displayToast={displayToast}
                />

                <SubCategoriesList
                    subCategoriesList={subCategoriesFiltered}
                    clickSubCategory={clickSubCategory}
                    selectedCategory={selectedCategory}
                    displayToast={displayToast}
                    selectedSubCategory={selectedSubCategory}
                />

            </div>                    
        </>
    )
}

export default Category