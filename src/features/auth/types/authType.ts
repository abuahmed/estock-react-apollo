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
  isAdmin: Boolean;
  status: UserStatus;
  verifiedAt: Date;
  token: string;
  expiredAt: Date;
  roles: [Role];
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
