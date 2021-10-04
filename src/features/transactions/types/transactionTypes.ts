import { Warehouse } from "../../auth/types/authType";
import { Item } from "../../setups/types/itemTypes";

export interface HeaderProps {
  type: TransactionType;
}

export type BusinessPartner = {
  id?: number;
  uuid?: string;
  isEnabled?: boolean;
  createdByUserId?: number;
  modifiedByUserId?: number;
  displayName?: string;
  description?: string;
  tinNumber?: string;
  vatNumber?: string;
  code?: string;
  creditLimit?: number;
  type?: BusinessPartnerType;
  category?: BusinessPartnerCategory;
  transactions?: [TransactionHeader];
};

export enum BusinessPartnerType {
  Customer = "Customer",
  Vendor = "Vendor",
}

export enum BusinessPartnerCategory {
  Organization = "Organization",
  Individual = "Individual",
}

export type TransactionLine = {
  id?: number;
  uuid?: string;
  isEnabled?: boolean;
  createdByUserId?: number;
  modifiedByUserId?: number;
  headerId?: number;
  itemId?: number;
  qty?: number;
  eachPrice?: number;
  diff?: number;
  header?: TransactionHeader;
  item?: Item;
  linePrice?: number;
};

export type TransactionHeader = {
  id?: number;
  uuid?: string;
  isEnabled?: boolean;
  createdByUserId?: number;
  modifiedByUserId?: number;
  type: TransactionType;
  status?: TransactionStatus;
  number?: string;
  numberOfItems?: number;
  totalQty?: number;
  totalAmount?: number;
  transactionDate?: Date;
  warehouseId?: number;
  warehouse?: Warehouse;
  businessPartnerId?: number;
  businessPartner?: BusinessPartner;
  lines?: [TransactionLine];
  comment?: string;
};

export enum TransactionType {
  All = "All",
  Sale = "Sale",
  Purchase = "Purchase",
  PI = "PI",
  Transfer = "Transfer",
  Profit = "Profit",
  GoodsIn = "GoodsIn",
  GoodsOut = "GoodsOut",
}

export enum TransactionStatus {
  New = "New",
  Draft = "Draft",
  Order = "Order",
  Posted = "Posted",
  PostedWithLessStock = "PostedWithLessStock",
  Completed = "Completed",
  Closed = "Closed",
  Approved = "Approved",
  Archived = "Archived",
  Canceled = "Canceled",
  OnProcess = "OnProcess",
  Shipped = "Shipped",
  DeliveryConfirmed = "DeliveryConfirmed",
  Received = "Received",
  Refunded = "Refunded",
}

export type Inventory = {
  id?: number;
  uuid?: string;
  isEnabled?: boolean;
  createdByUserId?: number;
  modifiedByUserId?: number;
  dateRecordCreated?: Date;
  dateLastModified?: Date;
  warehouseId?: number;
  itemId?: number;
  qtyOnHand?: number;
  warehouse?: Warehouse;
  item?: Item;
  totalPurchaseValue?: number;
  totalSaleValue?: number;
  totalProfitValue?: number;
};

export type TransactionsState = {
  inventories: Inventory[];
  inventorySummary: InventorySummary;
  topSalesItems: LineSummary[];
  topPurchasesItems: LineSummary[];
  dailyPurchasesSummary: DailySummary[];
  dailySalesSummary: DailySummary[];
  selectedInventory?: Inventory;
  headers: TransactionHeader[];
  lines: TransactionLine[];
  selectedHeader: TransactionHeader;
  selectedLine: TransactionLine;
  loading: "idle" | "pending";
  currentRequestId: string | undefined;
  success: any;
  error: any;
};

export type TransactionArgs = {
  skip?: number;
  take?: number;
  type?: TransactionType;
  status?: TransactionStatus;
  headerId?: number;
  itemId?: number;
  includeSales?: boolean;
  includePurchases?: boolean;
  includePIs?: boolean;
  includeTransfers?: boolean;
  durationBegin?: Date;
  durationEnd?: Date;
  refreshList?: string;
  lastUpdated?: Date;
};

export type Setting = {
  id?: number;
  uuid?: string;
  isEnabled?: boolean;
  createdByUserId?: number;
  modifiedByUserId?: number;
  dateRecordCreated?: Date;
  dateLastModified?: Date;
  lastInventoryUpdated?: Date;
  lastPIUpdated?: Date;
  lastPurchaseUpdated?: Date;
  lastSalesUpdated?: Date;
  lastItemsUpdated?: Date;
  lastBusinessPartnersUpdated?: Date;
};

export type InventorySummary = {
  warehouseId?: number;
  totalItems: number;
  totalPurchases: number;
  totalSales: number;
};

export type LineSummary = {
  warehouseId?: number;
  itemId?: number;
  itemName?: string;
  totalTransactions?: number;
  totalAmount?: number;
};
export type LineSummaryType = {
  type?: string;
  lineSummary?: LineSummary;
};

export type DailySummary = {
  warehouseId?: number;
  transactionDate?: string;
  totalTransactions?: number;
  totalAmount?: number;
};
export type DailySummaryType = {
  type?: TransactionType;
  dailySummary?: DailySummary;
};
