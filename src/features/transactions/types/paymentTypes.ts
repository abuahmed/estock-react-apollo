import { User } from "../../auth/types/authType";
import { BusinessPartner } from "../../setups/types/bpTypes";
import { Category } from "../../setups/types/itemTypes";
import { Organization, Warehouse } from "../../setups/types/warehouseTypes";
import { TransactionHeader } from "./transactionTypes";

export type FinancialAccount = {
  id?: number;
  uuid?: string;
  isEnabled?: boolean;
  createdByUserId?: number;
  modifiedByUserId?: number;
  bankId?: number;
  bank?: Category;
  branch?: string;
  accountNumber?: string;
  accountFormat?: string;
  iban?: string;
  swiftCode?: string;
  country?: string;
  organizationId?: number;
  organization?: Organization;
  businessPartnerId?: number;
  businessPartner?: BusinessPartner;
};
export type FinancialAccountsWithCount = {
  totalCount: number;
  financialAccounts: FinancialAccount[];
};
export type Check = {
  id?: number;
  uuid?: string;
  isEnabled?: boolean;
  createdByUserId?: number;
  modifiedByUserId?: number;
  checkDate?: Date;
  number?: string;
  customerAccountId?: number;
  customerAccount?: FinancialAccount;
  organizationAccountId?: number;
  organizationAccount?: FinancialAccount;
};

export type Clearance = {
  id?: number;
  uuid?: string;
  isEnabled?: boolean;
  createdByUserId?: number;
  modifiedByUserId?: number;
  statementNumber?: string;
  statementDate?: Date;
  depositedDate?: Date;
  depositedById?: number;
  depositedBy?: User;
  clearedDate?: Date;
  clearedById?: number;
  clearedBy?: User;
  organizationAccountId?: number;
  organizationAccount?: FinancialAccount;
};

export type Payment = {
  id?: number;
  uuid?: string;
  isEnabled?: boolean;
  createdByUserId?: number;
  modifiedByUserId?: number;
  method?: PaymentMethods;
  type?: PaymentTypes;
  status?: PaymentStatus;
  paymentDate?: Date;
  dueDate?: Date;
  amountRequired?: number;
  amount?: number;
  reason?: string;
  paymentRemark?: string;
  personName?: string;
  checkId?: number;
  clearanceId?: number;
  headerId?: number;
  warehouseId?: number;
  warehouse?: Warehouse;
  check?: Check;
  clearance?: Clearance;
  header?: TransactionHeader;
};

export enum PaymentMethods {
  Cash = "Cash",
  Cpo = "Cpo",
  Deposit = "Deposit",
  MobileTransfer = "MobileTransfer",
  Credit = "Credit",
  Check = "Check",
}
export enum CreditLimitTypes {
  Amount = "Amount",
  Transactions = "Transactions",
  Both = "Both",
}
export enum PaymentStatus {
  // NotPaid = "NotPaid", //will also contain NotPaidWithCheck = "NotPaidWithCheck",
  // Paid = "Paid", //will also contain CheckPaid = "CheckPaid",
  Deposited = "Deposited",
  Checked = "Checked",
  Verified = "Verified",
  Cleared = "Cleared",
  NotDeposited = "Not Deposited",
  NotCleared = "Not Cleared",
  NoPayment = "No Payment",
  Refunded = "Refunded",
}
export enum PaymentTypes {
  //We may only need CashIn & CashOut the others will be replaced by PaymentMethod and Sale/Purchase properties
  //CashIn may be Loans from others && CashOut are like Expenses and Loans to others
  Sale = "Sale",
  Purchase = "Purchase",
  CashIn = "CashIn",
  CashOut = "CashOut",
  SaleCredit = "SaleCredit",
  PurchaseCredit = "PurchaseCredit",
}
export enum TransactionPaymentStatus {
  PartiallyPaid = "PartiallyPaid",
  FullyPaid = "FullyPaid",
  NoPayment = "NoPayment",
}
export enum PaymentListTypes {
  All = "All",
  Paid = "Paid",
  NotPaid = "NotPaid",
  Checked = "Checked",
  Verified = "Verified",
  Cleared = "Cleared",
}

export enum InvoiceTerms {
  Immediate = "Immediate",
  AfterDelivery = "AfterDelivery",
  AfterOrderDelivered = "AfterOrderDelivered",
  CustomerScheduleAfterDelivery = "CustomerScheduleAfterDelivery",
  DoNotInvoice = "DoNotInvoice",
}
