export interface UpdateDebtCommand {
  debtId: number;
  debtName: string;
  startAmount: number;
  categoryId: number;
  subCategoryId: number;
  debtTypeId: number;
  debtorName: string;
  currentAmount: number;
  }