import { TransactionHeader } from "../../transactions/types/transactionTypes";
import { Address } from "./bpTypes";

export type Client = {
  id?: number;
  uuid?: string;
  isEnabled?: boolean;
  createdByUserId?: number;
  modifiedByUserId?: number;
  dateRecordCreated?: Date;
  dateLastModified?: Date;
  displayName?: string;
  description?: string;
  type?: ClientType;
  addressId?: number;
  organizations?: [Organization];
  address?: Address;
};

export enum ClientType {
  SingleOrgSingleStore = "SingleOrgSingleStore",
  SingleOrgMultiStore = "SingleOrgMultiStore",
  MultiOrgSingleStore = "MultiOrgSingleStore",
  MultiOrgMultiStore = "MultiOrgSingleStore",
}

export type Organization = {
  id?: number;
  uuid?: string;
  isEnabled?: boolean;
  createdByUserId?: number;
  modifiedByUserId?: number;
  dateRecordCreated?: Date;
  dateLastModified?: Date;
  displayName?: string;
  description?: string;
  clientId?: number;
  addressId?: number;
  client?: Client;
  warehouses?: [Warehouse];
  address?: Address;
};
export type Warehouse = {
  id?: number;
  uuid?: string;
  isEnabled?: boolean;
  createdByUserId?: number;
  modifiedByUserId?: number;
  dateRecordCreated?: Date;
  dateLastModified?: Date;
  displayName?: string;
  description?: string;
  organizationId?: number;
  addressId?: number;
  organization?: Organization;
  address?: Address;
  transactions?: [TransactionHeader];
  isPrivileged?: boolean;
};

export type WarehousesState = {
  clients?: Client[];
  selectedClient?: Client;
  organizations?: Organization[];
  selectedOrganization?: Organization;
  warehouses?: Warehouse[];
  selectedWarehouse?: Warehouse;
  loading?: "idle" | "pending";
  currentRequestId?: string | undefined;
  success?: any;
  error?: any;
};

export type FetchWarehousesOptions = {
  parent?: string;
  parentId?: number;
};

export type FetchWarehousesForUser = {
  warehouseIds?: Warehouse[];
  userId?: number;
};
//
