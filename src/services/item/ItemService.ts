import axios from "axios";
import { AccountResponse } from "models/account/AccountResponse";
import { AddAccountCommand } from "models/account/AddAccountCommand";
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