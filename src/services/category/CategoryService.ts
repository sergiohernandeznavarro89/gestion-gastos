import api from "../api";
import { AddCategoryCommand } from "models/category/AddCategoryCommand";
import { CategoryResponse } from "models/category/CategoryResponse";
import { UpdateCategoryCommand } from "models/category/UpdateCategoryCommand";
import { ResponseBase } from "models/shared/ResponseBase";



export const GetCategoriesByUser = async (userId: number): Promise<CategoryResponse[]> => {
    const response = await api.get<CategoryResponse[]>(`/api/Category/GetCategoriesByUser?userId=${userId}`);
    return response.data;
}

export const AddCategory = async (category: AddCategoryCommand) => {
    const body = JSON.stringify(category);
    const response = await api.post(`/api/Category/AddCategory`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

export const UpdateCategory = async (category: UpdateCategoryCommand) => {
    const body = JSON.stringify(category);
    const response = await api.put(`/api/Category/UpdateCategory`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

export const DeleteCategory = async (categoryId: number): Promise<ResponseBase> => {
    const response = await api.delete(`/api/Category/DeleteCategory?categoryId=${categoryId}`);
    return response.data;
}