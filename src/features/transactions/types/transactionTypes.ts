import { Warehouse } from "../../auth/types/authType";
import { Item } from "../../items/types/itemTypes";

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

enum BusinessPartnerType {
  Customer,
  Vendor,
}

enum BusinessPartnerCategory {
  Organization,
  Individual,
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
  businessPartner: BusinessPartner;
  lines?: [TransactionLine];
  comment?: string;
};

enum TransactionType {
  All,
  Sale,
  Purchase,
  PI,
  Transfer,
  Profit,
  GoodsIn,
  GoodsOut,
}

enum TransactionStatus {
  New,
  Draft,
  Order,
  Posted,
  PostedWithLessStock,
  Completed,
  Closed,
  Approved,
  Archived,
  Canceled,
  OnProcess,
  Shipped,
  DeliveryConfirmed,
  Received,
  Refunded,
}

export type TransactionsState = {
  headers: TransactionHeader[];
  lines: TransactionLine[];
  //selectedHeader: TransactionHeader;
  selectedLine: TransactionLine;
  loading: "idle" | "pending";
  currentRequestId: string | undefined;
  success: any;
  error: any;
};
