import { Role } from "../features/auth/types/authType";
import { TransactionType } from "../features/transactions/types/transactionTypes";

export const isPrivilegedTransaction = (
  roles: Role[],
  type: TransactionType,
  privileged: string
) => {
  privileged = privileged + " " + type;
  return roles.some(
    (r) =>
      r &&
      r.displayName &&
      r.displayName.toLowerCase() === privileged.toLowerCase()
  );
};
