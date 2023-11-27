import axios from "axios";
import { AddDebtPaymentCommand } from "models/debtPayment/AddDebtPaymentCommand";
import { DebtPaymentResponse } from "models/debtPayment/DebtPaymentResponse";

const API = process.env.REACT_APP_API_BASE_URL;

export const AddDebtPayment = async (debtPayment: AddDebtPaymentCommand) : Promise<DebtPaymentResponse> => {    
    const body = JSON.stringify(debtPayment);
    const response = await axios.post(`${API}/api/DebtPayment/AddDebtPayment`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}