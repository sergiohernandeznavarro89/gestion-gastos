export interface AddTransferCommand {
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
}
