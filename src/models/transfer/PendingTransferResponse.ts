export interface PendingTransferResponse {
    transferId: number;
    categoryId: number;
    subCategoryId: number | null;
    periodTypeId: number;
    userId: number;
    originAccountId: number;
    destinationAccountId: number;
    transferName: string;
    transferDesc: string;
    ammount: number;
    periodity: number | null;
    startDate: Date;
    endDate: Date;
    cancelled: boolean;
    originAccountName: string;
    destinationAccountName: string;
    categoryDesc: string;
    subCategoryDesc: string;
    periodTypeDesc: string;
}
