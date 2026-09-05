import api from "../api";
import { AddDebtCommand } from "models/debt/AddDebtCommand";
import { DebtResponse } from "models/debt/DebtResponse";
import { UpdateDebtCommand } from "models/debt/UpdateDebtCommand";



export const GetAllDebts = async (userId: number): Promise<DebtResponse[]> => {
    const response = await api.get<DebtResponse[]>(`/api/Debt/GetAllDebts?userId=${userId}`);
    return response.data;
}

export const AddDebt = async (debt: AddDebtCommand) => {
    const body = JSON.stringify(debt);
    const response = await api.post(`/api/Debt/AddDebt`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

export const UpdateDebt = async (debt: UpdateDebtCommand) => {
    const body = JSON.stringify(debt);
    const response = await api.put(`/api/Debt/UpdateDebt`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}