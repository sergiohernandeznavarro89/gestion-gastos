import { ResponseBase } from "models/shared/ResponseBase";

export interface AddDebtPaymentCommand {
    debtId: number;
    accountId: number;
    amount: number;
}