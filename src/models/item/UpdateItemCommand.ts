export interface UpdateItemCommand  {
    itemId: number;
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
    accountId: number;
  }