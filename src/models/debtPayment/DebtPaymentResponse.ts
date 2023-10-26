import { ResponseBase } from "models/shared/ResponseBase";

export interface DebtPaymentResponse extends ResponseBase{
    debtPaymentId: number;
}