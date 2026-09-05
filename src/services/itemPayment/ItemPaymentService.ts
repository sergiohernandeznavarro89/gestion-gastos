import api from "../api";
import { ItemPaymentResponse } from "models/itemPayment/ItemPaymentResponse";



export const AddItemPayment = async (itemId: number, ammount: number) : Promise<ItemPaymentResponse> => {    
    const response = await api.post(`/api/ItemPayment/AddItemPayment?itemId=${itemId}&ammount=${ammount}`, {
        headers: {
            'Content-Type': 'application/json'
        }});
    return response.data;
}