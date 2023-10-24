export interface DebtResponse {
    debtId: number;
    debtName: string;
    startAmount: number;
    date: Date;
    categoryId: number;
    subCategoryId: number;
    debtTypeId: number;
    userId: number;
    debtorName: string;
    currentAmount: number;
    completedDate: Date | null;
    categoryDesc: string;
    subCategoryDesc: string;
    debtTypeDesc: string;
}