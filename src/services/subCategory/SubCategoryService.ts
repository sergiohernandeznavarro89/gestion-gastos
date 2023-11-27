import axios from "axios";
import { AddSubCategoryCommand } from "models/subCategory/AddSubCategoryCommand";
import { SubCategoryResponse } from "models/subCategory/SubCategoryResponse";
import { UpdateSubCategoryCommand } from "models/subCategory/UpdateSubCategoryCommand";

const API = process.env.REACT_APP_API_BASE_URL;

export const GetSubCategoriesByUser = async (userId: number): Promise<SubCategoryResponse[]> => {
    const response = await axios.get<SubCategoryResponse[]>(`${API}/api/SubCategory/GetSubCategoriesByUser?userId=${userId}`);
    return response.data;
}

export const AddSubCategory = async (subCategory: AddSubCategoryCommand) => {
    const body = JSON.stringify(subCategory);
    const response = await axios.post(`${API}/api/SubCategory/AddSubCategory`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

export const UpdateSubCategory = async (subCategory: UpdateSubCategoryCommand) => {
    const body = JSON.stringify(subCategory);
    const response = await axios.put(`${API}/api/SubCategory/UpdateSubCategory`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}