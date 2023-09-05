import axios from "axios";
import { AddItemCommand } from "models/item/AddItemCommand";
import { PendingPayItemsResponse } from "models/item/PendingPayItemResponse";

const API = "https://sergiohn89.bsite.net";

export const GetPendingPayItems = async (userId: number): Promise<PendingPayItemsResponse[]> => {
    const response = await axios.get<PendingPayItemsResponse[]>(`${API}/api/Item/GetPendingPayItems?userId=${userId}`);
    return response.data;
}

export const GetNextMonthPendingPayItems = async (userId: number): Promise<PendingPayItemsResponse[]> => {
    const response = await axios.get<PendingPayItemsResponse[]>(`${API}/api/Item/GetNextMonthPendingPayItems?userId=${userId}`);
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