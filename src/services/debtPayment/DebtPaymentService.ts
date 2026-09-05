import api from "../api";
import { AddDebtPaymentCommand } from "models/debtPayment/AddDebtPaymentCommand";
import { DebtPaymentResponse } from "models/debtPayment/DebtPaymentResponse";



export const AddDebtPayment = async (debtPayment: AddDebtPaymentCommand) : Promise<DebtPaymentResponse> => {    
    const body = JSON.stringify(debtPayment);
    const response = await api.post(`/api/DebtPayment/AddDebtPayment`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}