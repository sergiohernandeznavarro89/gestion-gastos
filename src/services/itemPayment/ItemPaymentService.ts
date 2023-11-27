import axios from "axios";
import { ItemPaymentResponse } from "models/itemPayment/ItemPaymentResponse";

const API = process.env.REACT_APP_API_BASE_URL;

export const AddItemPayment = async (itemId: number, ammount: number) : Promise<ItemPaymentResponse> => {    
    const response = await axios.post(`${API}/api/ItemPayment/AddItemPayment?itemId=${itemId}&ammount=${ammount}`, {
        headers: {
            'Content-Type': 'application/json'
        }});
    return response.data;
}