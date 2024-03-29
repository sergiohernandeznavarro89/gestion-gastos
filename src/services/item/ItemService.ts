import axios from "axios";
import { AddItemCommand } from "models/item/AddItemCommand";
import { ItemResponse } from "models/item/ItemResponse";
import { PendingPayItemsResponse } from "models/item/PendingPayItemResponse";
import { UpdateItemCommand } from "models/item/UpdateItemCommand";

const API = process.env.REACT_APP_API_BASE_URL;

export const GetPendingPayItems = async (userId: number): Promise<PendingPayItemsResponse[]> => {
    const response = await axios.get<PendingPayItemsResponse[]>(`${API}/api/Item/GetPendingPayItems?userId=${userId}`);
    return response.data;
}

export const GetNextMonthPendingPayItems = async (userId: number): Promise<PendingPayItemsResponse[]> => {
    const response = await axios.get<PendingPayItemsResponse[]>(`${API}/api/Item/GetNextMonthPendingPayItems?userId=${userId}`);
    return response.data;
}

export const GetAllItems = async (userId: number): Promise<ItemResponse[]> => {
    const response = await axios.get<ItemResponse[]>(`${API}/api/Item/GetAllItems?userId=${userId}`);
    return response.data;
}

export const AddItem = async (item: AddItemCommand) => {
    const body = JSON.stringify(item);
    const response = await axios.post(`${API}/api/Item/AddItem`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

export const UpdateItem = async (item: UpdateItemCommand) => {
    const body = JSON.stringify(item);
    const response = await axios.put(`${API}/api/Item/UpdateItem`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}