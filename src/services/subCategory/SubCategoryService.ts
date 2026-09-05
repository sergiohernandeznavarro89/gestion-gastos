import api from "../api";
import { AddSubCategoryCommand } from "models/subCategory/AddSubCategoryCommand";
import { SubCategoryResponse } from "models/subCategory/SubCategoryResponse";
import { UpdateSubCategoryCommand } from "models/subCategory/UpdateSubCategoryCommand";
import { ResponseBase } from "models/shared/ResponseBase";



export const GetSubCategoriesByUser = async (userId: number): Promise<SubCategoryResponse[]> => {
    const response = await api.get<SubCategoryResponse[]>(`/api/SubCategory/GetSubCategoriesByUser?userId=${userId}`);
    return response.data;
}

export const AddSubCategory = async (subCategory: AddSubCategoryCommand) => {
    const body = JSON.stringify(subCategory);
    const response = await api.post(`/api/SubCategory/AddSubCategory`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

export const UpdateSubCategory = async (subCategory: UpdateSubCategoryCommand) => {
    const body = JSON.stringify(subCategory);
    const response = await api.put(`/api/SubCategory/UpdateSubCategory`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

export const DeleteSubCategory = async (subCategoryId: number): Promise<ResponseBase> => {
    const response = await api.delete(`/api/SubCategory/DeleteSubCategory?subCategoryId=${subCategoryId}`);
    return response.data;
}