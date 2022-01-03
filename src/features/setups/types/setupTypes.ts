export type UserArgs = {
  skip?: number;
  take?: number;
  searchText?: string;
  clientId?: number;
  refreshList?: string;
  lastUpdated?: Date;
};

export type ClientArgs = {
  skip?: number;
  take?: number;
  searchText?: string;
  refreshList?: string;
  lastUpdated?: Date;
};

export type OrganizationArgs = {
  skip?: number;
  take?: number;
  searchText?: string;
  clientId?: number;
  refreshList?: string;
  lastUpdated?: Date;
};

export type WarehouseArgs = {
  skip?: number;
  take?: number;
  searchText?: string;
  parent?: string;
  parentId?: number;
  refreshList?: string;
  lastUpdated?: Date;
};
