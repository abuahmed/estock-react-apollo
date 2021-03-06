import { AuthUser, Role } from "../../auth/types/authType";
import { TransactionHeader } from "../../transactions/types/transactionTypes";
import { Category, Item, ItemsWithCount } from "./itemTypes";
import {
  FinancialAccount,
  FinancialAccountsWithCount,
} from "../../transactions/types/paymentTypes";

import { Client, Organization, Warehouse } from "./warehouseTypes";

export interface BusinessPartnerProps {
  type: BusinessPartnerType;
}

export type Address = {
  id?: number;
  uuid?: string;
  isEnabled?: boolean;
  createdByUserId?: number;
  modifiedByUserId?: number;
  dateRecordCreated?: Date;
  dateLastModified?: Date;
  country?: string;
  city?: string;
  subCity?: string;
  streetAddress?: string;
  woreda?: string;
  kebele?: string;
  houseNumber?: string;
  telephone?: string;
  alternateTelephone?: string;
  mobile?: string;
  alternateMobile?: string;
  email?: string;
  alternateEmail?: string;
  webAddress?: string;
  fax?: string;
  poBox?: string;
  notes?: string;
};

export type Contact = {
  id?: number;
  uuid?: string;
  isEnabled?: boolean;
  createdByUserId?: number;
  modifiedByUserId?: number;
  dateRecordCreated?: Date;
  dateLastModified?: Date;
  fullName?: string;
  address?: Address;
};

export type BusinessPartner = {
  id?: number;
  uuid?: string;
  isEnabled?: boolean;
  createdByUserId?: number;
  modifiedByUserId?: number;
  dateRecordCreated?: Date;
  dateLastModified?: Date;
  displayName?: string;
  description?: string;
  tinNumber?: string;
  vatNumber?: string;
  code?: string;
  creditLimit?: number;
  creditTransactionsLimit?: number;
  creditsWithoutCheck?: boolean;
  totalOutstandingCredit?: number;
  initialOutstandingCredit?: number;
  noOfOutstandingTransactions?: number;
  type?: BusinessPartnerType;
  category?: BusinessPartnerCategory;
  address?: Address;
  contact?: Contact;
  salesPerson?: SalesPerson;
  transactions?: [TransactionHeader];
};
export type BusinessPartnersWithCount = {
  totalCount: number;
  businessPartners: BusinessPartner[];
};
export type SalesPerson = {
  id?: number;
  uuid?: string;
  isEnabled?: boolean;
  createdByUserId?: number;
  modifiedByUserId?: number;
  dateRecordCreated?: Date;
  dateLastModified?: Date;
  code?: string;
  salesLimit?: number;
  contact?: Contact;
  businessPartners?: [BusinessPartner];
};
export type SalesPersonsWithCount = {
  totalCount: number;
  salesPersons: SalesPerson[];
};
export enum BusinessPartnerType {
  Customer = "Customer",
  Vendor = "Vendor",
}

export enum BusinessPartnerCategory {
  Organization = "Organization",
  Individual = "Individual",
}

export type RemoveBusinessPartner = {
  type?: BusinessPartnerType;
  id?: number;
};

export type BusinessPartnerArgs = {
  type: BusinessPartnerType;
  skip?: number;
  take?: number;
  searchText?: string;
  amountBelow?: number;
  amountAbove?: number;
  refreshList?: string;
  lastUpdated?: Date;
};

export type SetupsState = {
  categories: Category[];
  // categoriesWithCount: CategoriesWithCount;
  // uomsWithCount: UomsWithCount;
  // banksWithCount: BanksWithCount;
  financialAccountsWithCount: FinancialAccountsWithCount;
  itemsWithCount: ItemsWithCount;
  selectedCategory: Category;
  selectedItem: Item;
  selectedFinancialAccount: FinancialAccount;
  businessPartnersWithCount: BusinessPartnersWithCount;
  selectedBusinessPartner: BusinessPartner;
  clients: Client[];
  selectedClient: Client;
  organizations: Organization[];
  selectedOrganization: Organization;
  warehouses: Warehouse[];
  selectedWarehouse: Warehouse;
  users: AuthUser[];
  roles: Role[];
  selectedUser: AuthUser | null;
  loading: "idle" | "pending";
  currentRequestId: string | undefined;
  success: any;
  error: any;
};
