import axios from "axios";
import { AccountResponse } from "models/account/AccountResponse";
import { AddAccountCommand } from "models/account/AddAccountCommand";

const API = "http://localhost";

export const GetAccountsByUser = async (userId: number): Promise<AccountResponse[]> => {
    const response = await axios.get<AccountResponse[]>(`${API}/api/Account/GetAccountsByUser?userId=${userId}`);
    return response.data;
}

export const AddAccount = async (account: AddAccountCommand) => {
    const body = JSON.stringify(account);
    const response = await axios.post(`${API}/api/Account/AddAccount`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}