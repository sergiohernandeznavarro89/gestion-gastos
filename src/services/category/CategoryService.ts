import axios from "axios";
import { AddCategoryCommand } from "models/category/AddCategoryCommand";
import { CategoryResponse } from "models/category/CategoryResponse";
import { UpdateCategoryCommand } from "models/category/UpdateCategoryCommand";

const API = "https://sergiohn89.bsite.net";

export const GetCategoriesByUser = async (userId: number): Promise<CategoryResponse[]> => {
    const response = await axios.get<CategoryResponse[]>(`${API}/api/Category/GetCategoriesByUser?userId=${userId}`);
    return response.data;
}

export const AddCategory = async (category: AddCategoryCommand) => {
    const body = JSON.stringify(category);
    const response = await axios.post(`${API}/api/Category/AddCategory`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

export const UpdateCategory = async (category: UpdateCategoryCommand) => {
    const body = JSON.stringify(category);
    const response = await axios.put(`${API}/api/Category/UpdateCategory`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}