export interface ItemResponse {
    itemId: number;
    itemName: string;
    itemDesc: string;
    ammount: number;
    periodity?: number | null;
    startDate: Date;
    endDate: Date;
    cancelled: boolean;
    categoryId: number;
    subCategoryId?: number | null;
    itemTypeId: number;
    ammountTypeId: number;
    periodTypeId: number;
    userId: number;
    accountId: number;
    accountName: string;
    categoryDesc: string;
    subCategoryDesc: string;
    itemTypeDesc: string;
    ammountTypeDesc: string;
    periodTypeDesc: string;
}