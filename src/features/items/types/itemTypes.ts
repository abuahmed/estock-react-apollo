export type Category = {
  id?: number;
  uuid?: string;
  isEnabled?: boolean;
  createdByUserId?: number;
  modifiedByUserId?: number;
  displayName?: string;
  description?: string;
  type?: CategoryType;
  parentCategory?: Category;
  childCategories?: [Category];
};

export enum CategoryType {
  ItemCategory = "ItemCategory",
  UnitOfMeasure = "UnitOfMeasure",
  Bank = "Bank",
}

// export type Item = {
//   id: number;
//   uuid: string;
//   isEnabled: boolean;
//   createdByUserId: number;
//   modifiedByUserId: number;
//   dateRecordCreated: Date;
//   dateLastModified: Date;
//   displayName: string;
//   description: string;
//   type: ItemType;
//   code: string;
//   pictureUrl: string;
//   itemCategoryId: number;
//   itemCategory: Category;
//   unitOfMeasureId: number;
//   unitOfMeasure: Category;
//   purchasePrice: number;
//   sellingPrice: number;
//   safeQty: number;
// };

export type Item = {
  id?: number;
  uuid?: string;
  isEnabled?: boolean;
  createdByUserId?: number;
  modifiedByUserId?: number;
  dateRecordCreated?: Date;
  dateLastModified?: Date;
  displayName?: string;
  description?: string;
  type?: ItemType;
  pictureUrl?: string;
  itemCategoryId?: number;
  itemCategory?: Category;
  unitOfMeasureId?: number;
  unitOfMeasure?: Category;
  purchasePrice?: number;
  sellingPrice?: number;
  safeQty?: number | null;
};

enum ItemType {
  Purchased,
  Manufactured,
  Service,
}

export type ItemsState = {
  items: Item[];
  categories: Category[];
  uoms: Category[];
  selectedItem: Item;
  loading: "idle" | "pending";
  currentRequestId: string | undefined;
  success: any;
  error: any;
};
