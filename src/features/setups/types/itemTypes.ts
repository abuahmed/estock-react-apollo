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
export type itemsWithSummary = {
  totalCount?: number;
  totalAmount?: number;
  items?: Item[];
};
export type RemoveCategory = {
  type?: CategoryType;
  id?: number;
};

export enum CategoryType {
  ItemCategory = "ItemCategory",
  UnitOfMeasure = "UnitOfMeasure",
  Bank = "Bank",
}

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

export type ItemArgs = {
  skip?: number;
  take?: number;
  itemId?: number;
  categoryId?: number;
  uomId?: number;
  searchText?: string;
  amountBelow?: number;
  amountAbove?: number;
  refreshList?: string;
  lastUpdated?: Date;
};
export type CategoryArgs = {
  skip?: number;
  take?: number;
  type?: CategoryType;

  searchText?: string;

  refreshList?: string;
  lastUpdated?: Date;
};
