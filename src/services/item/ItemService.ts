import api from "../api";
import { AddItemCommand } from "models/item/AddItemCommand";
import { ItemResponse } from "models/item/ItemResponse";
import { PendingPayItemsResponse } from "models/item/PendingPayItemResponse";
import { UpdateItemCommand } from "models/item/UpdateItemCommand";
import { ResponseBase } from "models/shared/ResponseBase";



export const GetPendingPayItems = async (userId: number): Promise<PendingPayItemsResponse[]> => {
    const response = await api.get<PendingPayItemsResponse[]>(`/api/Item/GetPendingPayItems?userId=${userId}`);
    return response.data;
}

export const GetNextMonthPendingPayItems = async (userId: number): Promise<PendingPayItemsResponse[]> => {
    const response = await api.get<PendingPayItemsResponse[]>(`/api/Item/GetNextMonthPendingPayItems?userId=${userId}`);
    return response.data;
}

export const GetAllItems = async (userId: number): Promise<ItemResponse[]> => {
    const response = await api.get<ItemResponse[]>(`/api/Item/GetAllItems?userId=${userId}`);
    return response.data;
}

export const AddItem = async (item: AddItemCommand) => {
    const body = JSON.stringify(item);
    const response = await api.post(`/api/Item/AddItem`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

export const UpdateItem = async (item: UpdateItemCommand) => {
    const body = JSON.stringify(item);
    const response = await api.put(`/api/Item/UpdateItem`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

export const DeleteItem = async (itemId: number): Promise<ResponseBase> => {
    const response = await api.delete(`/api/Item/DeleteItem/${itemId}`);
    return response.data;
}