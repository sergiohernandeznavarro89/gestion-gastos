import axios from "axios";
import { AddDebtPaymentCommand } from "models/debtPayment/AddDebtPaymentCommand";
import { DebtPaymentResponse } from "models/debtPayment/DebtPaymentResponse";

const API = "https://sergiohn89.bsite.net";

export const AddDebtPayment = async (debtPayment: AddDebtPaymentCommand) : Promise<DebtPaymentResponse> => {    
    const body = JSON.stringify(debtPayment);
    const response = await axios.post(`${API}/api/DebtPayment/AddDebtPayment`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}