import axios from "axios";
import { AddDebtCommand } from "models/debt/AddDebtCommand";
import { DebtResponse } from "models/debt/DebtResponse";
import { UpdateDebtCommand } from "models/debt/UpdateDebtCommand";

const API = "https://sergiohn89.bsite.net"

export const GetAllDebts = async (userId: number): Promise<DebtResponse[]> => {
    const response = await axios.get<DebtResponse[]>(`${API}/api/Debt/GetAllDebts?userId=${userId}`);
    return response.data;
}

export const AddDebt = async (debt: AddDebtCommand) => {
    const body = JSON.stringify(debt);
    const response = await axios.post(`${API}/api/Debt/AddDebt`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

export const UpdateDebt = async (debt: UpdateDebtCommand) => {
    const body = JSON.stringify(debt);
    const response = await axios.put(`${API}/api/Debt/UpdateDebt`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}