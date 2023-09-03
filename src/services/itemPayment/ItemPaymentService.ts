import axios from "axios";
import { AccountResponse } from "models/account/AccountResponse";
import { AddAccountCommand } from "models/account/AddAccountCommand";
import { PendingPayItemsResponse } from "models/item/PendingPayItemResponse";
import { ItemPaymentResponse } from "models/itemPayment/ItemPaymentResponse";

const API = "http://localhost";

export const AddItemPayment = async (itemId: number) : Promise<ItemPaymentResponse> => {    
    const response = await axios.post(`${API}/api/ItemPayment/AddItemPayment?itemId=${itemId}`, {
        headers: {
            'Content-Type': 'application/json'
        }});
    return response.data;
}