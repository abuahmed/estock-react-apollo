import { Warehouse } from "../../auth/types/authType";
import { Item } from "../../items/types/itemTypes";

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
};

export type TransactionHeader = {
  id?: number;
  uuid?: string;
  isEnabled?: boolean;
  createdByUserId?: number;
  modifiedByUserId?: number;
  type?: TransactionType;
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

export type TransactionsState = {
  headers: TransactionHeader[];
  lines: TransactionLine[];
  selectedHeader: TransactionHeader;
  selectedLine: TransactionLine;
  loading: "idle" | "pending";
  currentRequestId: string | undefined;
  success: any;
  error: any;
};