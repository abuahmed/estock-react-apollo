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
export type Warehouse = {
  id?: number;
  uuid?: string;
  isEnabled?: Boolean;
  createdByUserId?: number;
  modifiedByUserId?: number;
  displayName?: string;
  description?: string;
  descriptionShort?: string;
  isPrivileged?: boolean;
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
  error: AuthError | undefined;
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

export type AuthError = {
  code: string;
  message: string;
  stack: string;
  id: string;
};
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
// export type AuthProfile = {
//   name: string;
//   email: string;
//   avatar: string;
//   bio: string;
// };
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

  PI = "Physical Inventory",
  ViewPI = "View Physical Inventory",
  AddPI = "Add Physical Inventory",
  PostPI = "Post Physical Inventory",
  UnPostPI = "UnPost Physical Inventory",
  DeletePI = "Delete Physical Inventory",
  HistoryPI = "Pi Lines History",

  Sales = "Sales",
  ViewSales = "View Sales",
  AddSales = "Add Sales",
  PostSales = "Post Sales",
  UnPostSales = "UnPost Sales",
  DeleteSales = "Delete Sales",
  HistorySales = "Sales Lines History",

  Purchase = "Purchase",
  ViewPurchase = "View Purchase",
  AddPurchase = "Add Purchase",
  PostPurchase = "Post Purchase",
  UnPostPurchase = "UnPost Purchase",
  DeletePurchase = "Delete Purchase",
  HistoryPurchase = "Purchase Lines History",
}
