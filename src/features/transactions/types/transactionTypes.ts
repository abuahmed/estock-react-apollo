import { BusinessPartner } from "../../setups/types/bpTypes";
import { Item } from "../../setups/types/itemTypes";
import { Warehouse } from "../../setups/types/warehouseTypes";
import {
  Payment,
  PaymentMethods,
  PaymentStatus,
  PaymentTypes,
} from "./paymentTypes";

export interface HeaderProps {
  type: TransactionType;
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

export type HeadersWithCount = {
  totalCount: number;
  headers: TransactionHeader[];
};
export type InventoriesWithCount = {
  totalCount: number;
  inventories: Inventory[];
};
export type TransactionSummary = {
  id?: number;
  totalAmount?: number;
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
  toWarehouseId?: number;
  toWarehouse?: Warehouse;
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
  inventorySummary: InventorySummary;
  topSalesItems: LineSummary[];
  topPurchasesItems: LineSummary[];
  dailyPurchasesSummary: DailySummary[];
  dailySalesSummary: DailySummary[];
  selectedInventory?: Inventory;
  inventoriesWithCount: InventoriesWithCount;
  headersWithCount: HeadersWithCount;
  lines: TransactionLine[];
  payments: Payment[];
  selectedHeader: TransactionHeader;
  selectedLine: TransactionLine;
  selectedPayment: Payment;
  loading: "idle" | "pending";
  currentRequestId: string | undefined;
  success: any;
  error: any;
};

export type InventoryArgs = {
  skip?: number;
  take?: number;
  warehouseId?: number;
  itemId?: number;
  categoryId?: number;
  uomId?: number;
  searchText?: string;
  itemsBelow?: number;
  itemsAbove?: number;
  amountBelow?: number;
  amountAbove?: number;
  refreshList?: string;
  lastUpdated?: Date;
};

export type TransactionArgs = {
  skip?: number;
  take?: number;
  type?: TransactionType;
  durationBegin?: Date;
  durationEnd?: Date;
  warehouseId?: number;
  businessPartnerId?: number;
  includeLines?: boolean;
  groupByDate?: boolean;
  searchText?: string;
  itemsBelow?: number;
  itemsAbove?: number;
  amountBelow?: number;
  amountAbove?: number;
  refreshList?: string;
  lastUpdated?: Date;
};

export type LineArgs = {
  skip?: number;
  take?: number;
  status?: TransactionStatus;
  headerId?: number;
  itemId?: number;
  warehouseId?: number;
  businessPartnerId?: number;
  includeSales?: boolean;
  includePurchases?: boolean;
  includePIs?: boolean;
  includeTransfers?: boolean;
  durationBegin?: Date;
  durationEnd?: Date;
  refreshList?: string;
  lastUpdated?: Date;
};

export type PaymentArgs = {
  skip?: number;
  take?: number;
  type?: PaymentTypes;
  status?: PaymentStatus;
  method?: PaymentMethods;
  headerId?: number;
  searchText?: string;
  durationBegin?: Date;
  durationEnd?: Date;
  amountBelow?: number;
  amountAbove?: number;
  refreshList?: string;
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
