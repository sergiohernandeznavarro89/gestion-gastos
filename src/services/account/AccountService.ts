import api from "../api";
import { AccountResponse } from "models/account/AccountResponse";
import { AddAccountCommand } from "models/account/AddAccountCommand";
import { UpdateAccountCommand } from "models/account/UpdateAccountCommand";
import { ResponseBase } from "models/shared/ResponseBase";



export const GetAccountsByUser = async (userId: number): Promise<AccountResponse[]> => {
    const response = await api.get<AccountResponse[]>(`/api/Account/GetAccountsByUser?userId=${userId}`);
    return response.data;
}

export const AddAccount = async (account: AddAccountCommand) => {
    const body = JSON.stringify(account);
    const response = await api.post(`/api/Account/AddAccount`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

export const UpdateAccount = async (account: UpdateAccountCommand) => {
    const body = JSON.stringify(account);
    const response = await api.put(`/api/Account/UpdateAccount`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

export const DeleteAccount = async (accountId: number): Promise<ResponseBase> => {
    const response = await api.delete(`/api/Account/DeleteAccount?accountId=${accountId}`);
    return response.data;
}