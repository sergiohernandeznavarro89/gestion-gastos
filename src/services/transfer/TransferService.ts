import api from "../api";
import { ResponseBase } from "models/shared/ResponseBase";
import { AddTransferCommand } from "models/transfer/AddTransferCommand";
import { PendingTransferResponse } from "models/transfer/PendingTransferResponse";
import { TransferResponse } from "models/transfer/TransferResponse";
import { UpdateTransferCommand } from "models/transfer/UpdateTransferCommand";
import { AddTransferPaymentCommand } from "models/transferPayment/AddTransferPaymentCommand";

export const GetPendingPayTransfers = async (userId: number): Promise<PendingTransferResponse[]> => {
    const response = await api.get<PendingTransferResponse[]>(`/api/Transfer/pendingPay?userId=${userId}`);
    return response.data;
}

export const GetNextMonthPendingPayTransfers = async (userId: number): Promise<PendingTransferResponse[]> => {
    const response = await api.get<PendingTransferResponse[]>(`/api/Transfer/nextMonthPendingPay?userId=${userId}`);
    return response.data;
}

export const GetAllTransfers = async (userId: number): Promise<TransferResponse[]> => {
    const response = await api.get<TransferResponse[]>(`/api/Transfer/all?userId=${userId}`);
    return response.data;
}

export const AddTransfer = async (transfer: AddTransferCommand): Promise<ResponseBase> => {
    const body = JSON.stringify(transfer);
    const response = await api.post<ResponseBase>(`/api/Transfer/add`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

export const UpdateTransfer = async (transfer: UpdateTransferCommand): Promise<ResponseBase> => {
    const body = JSON.stringify(transfer);
    const response = await api.put<ResponseBase>(`/api/Transfer/update`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

export const DeleteTransfer = async (transferId: number): Promise<ResponseBase> => {
    const response = await api.delete<ResponseBase>(`/api/Transfer/delete?transferId=${transferId}`);
    return response.data;
}

export const AddTransferPayment = async (payment: AddTransferPaymentCommand): Promise<ResponseBase> => {
    const body = JSON.stringify(payment);
    const response = await api.post<ResponseBase>(`/api/Transfer/addPayment`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}
