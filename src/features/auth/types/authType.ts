import { Warehouse } from "../../setups/types/warehouseTypes";

export type AuthUser = {
  id: number;
  uuid: string;
  isEnabled: Boolean;
  createdByUserId: number;
  modifiedByUserId: number;
  name: string;
  email: string;
  password: string;
  salt: string;
  avatar: string;
  bio: string;
  isAdmin: boolean;
  status: UserStatus;
  verifiedAt: Date;
  token: string;
  expiredAt: Date;
  roles: Role[];
  warehouses?: Warehouse[];
};

export type Role = {
  id: number;
  uuid: string;
  isEnabled: Boolean;
  createdByUserId: number;
  modifiedByUserId: number;
  displayName: string;
  description: string;
  descriptionShort: string;
  isPrivileged: boolean;
};

enum UserStatus {
  Waiting,
  Active,
  Disabled,
  Blocked,
}

export type AuthState = {
  user: AuthUser | undefined;
  //me: AuthProfile | undefined;
  loading: "idle" | "pending";
  currentRequestId: undefined | string;
  fileUploadUri: undefined | string;
  error: RejectWithValueType | undefined;
  success: AuthSuccess | undefined;
};

export type UserCredentials = {
  email: string;
  password: string;
};

export type User = {
  name: string;
  confirmPassword: string;
};

export type NewUser = User & UserCredentials;

export type AuthSuccess = {
  message: string;
};

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  isAdmin: string;
  token: string;
};

export type UpdatePassword = {
  userId: string;
  oldPassword: string;
  password: string;
  confirmPassword: string;
};
export type ForgotAuth = {
  email: string;
};

export type ResetAuth = {
  password: string;
  confirmPassword: string;
  id: string;
  token: string;
};
export type VerifyAuth = {
  expires: string;
  id: string;
  token: string;
  signature: string;
};
export type VerifyResendAuth = {
  id: string;
};

export type Upload = {
  image: File;
};

export enum RoleTypes {
  ViewDashboard = "View Dashboard",

  Users = "Users",
  Customers = "Customers Entry",
  Vendors = "Vendors Entry",
  Items = "Items Entry",

  OnHandInventory = "OnHand Inventory",

  //PI = "Physical Inventory",
  ViewPI = "View PI",
  AddPI = "Add PI",
  PostPI = "Post PI",
  UnPostPI = "UnPost PI",
  DeletePI = "Delete PI",
  // HistoryPI = "Pi Lines History", same as View PI

  // Sales = "Sales",
  ViewSale = "View Sale",
  AddSale = "Add Sale",
  PostSale = "Post Sale",
  UnPostSale = "UnPost Sale",
  DeleteSale = "Delete Sale",
  //HistorySales = "Sales Lines History",

  // Purchase = "Purchase",
  ViewPurchase = "View Purchase",
  AddPurchase = "Add Purchase",
  PostPurchase = "Post Purchase",
  UnPostPurchase = "UnPost Purchase",
  DeletePurchase = "Delete Purchase",
  //HistoryPurchase = "Purchase Lines History",

  ViewTransfer = "View Transfer",
  AddTransfer = "Add Transfer",
  PostTransfer = "Post Transfer",
  UnPostTransfer = "UnPost Transfer",
  DeleteTransfer = "Delete Transfer",
}

export type RejectWithValueType = {
  code: string;
  message: string;
  stack: string;
  id: string;
};
