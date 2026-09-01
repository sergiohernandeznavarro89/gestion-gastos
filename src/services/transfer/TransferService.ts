import axios from "axios";
import { ResponseBase } from "models/shared/ResponseBase";
import { AddTransferCommand } from "models/transfer/AddTransferCommand";
import { PendingTransferResponse } from "models/transfer/PendingTransferResponse";
import { TransferResponse } from "models/transfer/TransferResponse";
import { UpdateTransferCommand } from "models/transfer/UpdateTransferCommand";
import { AddTransferPaymentCommand } from "models/transferPayment/AddTransferPaymentCommand";

const API = process.env.REACT_APP_API_BASE_URL;

export const GetPendingPayTransfers = async (userId: number): Promise<PendingTransferResponse[]> => {
    const response = await axios.get<PendingTransferResponse[]>(`${API}/api/Transfer/pendingPay?userId=${userId}`);
    return response.data;
}

export const GetNextMonthPendingPayTransfers = async (userId: number): Promise<PendingTransferResponse[]> => {
    const response = await axios.get<PendingTransferResponse[]>(`${API}/api/Transfer/nextMonthPendingPay?userId=${userId}`);
    return response.data;
}

export const GetAllTransfers = async (userId: number): Promise<TransferResponse[]> => {
    const response = await axios.get<TransferResponse[]>(`${API}/api/Transfer/all?userId=${userId}`);
    return response.data;
}

export const AddTransfer = async (transfer: AddTransferCommand): Promise<ResponseBase> => {
    const body = JSON.stringify(transfer);
    const response = await axios.post<ResponseBase>(`${API}/api/Transfer/add`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

export const UpdateTransfer = async (transfer: UpdateTransferCommand): Promise<ResponseBase> => {
    const body = JSON.stringify(transfer);
    const response = await axios.put<ResponseBase>(`${API}/api/Transfer/update`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

export const DeleteTransfer = async (transferId: number): Promise<ResponseBase> => {
    const response = await axios.delete<ResponseBase>(`${API}/api/Transfer/delete?transferId=${transferId}`);
    return response.data;
}

export const AddTransferPayment = async (payment: AddTransferPaymentCommand): Promise<ResponseBase> => {
    const body = JSON.stringify(payment);
    const response = await axios.post<ResponseBase>(`${API}/api/Transfer/addPayment`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}
