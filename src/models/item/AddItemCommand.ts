export interface AddItemCommand {
    itemName: string;
    itemDesc?: string;
    ammount?: number;
    periodity?: number;
    startDate?: string;
    endDate?: string;
    cancelled: boolean;
    categoryId: number;
    subCategoryId?: number;
    itemTypeId: number;
    ammountTypeId: number;
    periodTypeId: number;
    userId: number;
    accountId: number;
  }