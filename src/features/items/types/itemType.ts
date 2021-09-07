export type Category = {
  id: number;
  uuid: string;
  isEnabled: boolean;
  createdByUserId: number;
  modifiedByUserId: number;
  dateRecordCreated: Date;
  dateLastModified: Date;
  displayName: string;
  description: string;
  type: CategoryType;
  parentCategory: Category;
  childCategories: [Category];
};

enum CategoryType {
  ItemCategory,
  UnitOfMeasure,
  Bank,
}

export type Item = {
  id: number;
  uuid: string;
  isEnabled: boolean;
  createdByUserId: number;
  modifiedByUserId: number;
  dateRecordCreated: Date;
  dateLastModified: Date;
  displayName: string;
  description: string;
  type: ItemType;
  code: string;
  pictureUrl: string;
  itemCategoryId: number;
  itemCategory: Category;
  unitOfMeasureId: number;
  unitOfMeasure: Category;
  purchasePrice: number;
  sellingPrice: number;
  safeQty: number;
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
  selectedItem: Item | null;
  loading: "idle" | "pending";
  currentRequestId: string | undefined;
  success: any;
  error: any;
};
