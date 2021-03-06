import { gql } from "@apollo/client";
import { GET_ITEM } from "../fragments/items";
import { HEADER, LINE } from "../fragments/transaction";

export const GET_INVENTORY_SUMMARY = gql`
  query {
    getInventorySummary {
      warehouseId
      totalItems
      totalPurchases
      totalSales
    }
  }
`;
export const GET_DAILY_TRANSACTIONS_SUMMARY = gql`
  query GetDailyTransactions($type: TransactionType!) {
    dailyTransactions(
      type: $type
      durationBegin: "2021-08-11"
      durationEnd: "2022-12-11"
      take: 7
      groupByDate: true
    ) {
      transactionDate
      totalTransactions
      totalAmount
    }
  }
`;
export const GET_TOP_ITEMS = gql`
  query GetTopItems($includeSales: Boolean, $includePurchases: Boolean) {
    topItems(
      includeSales: $includeSales
      includePurchases: $includePurchases
      durationBegin: "2021-08-11"
      durationEnd: "2022-12-11"
      status: Posted
    ) {
      itemId
      itemName
      totalTransactions
      totalAmount
    }
  }
`;
export const GET_ALL_TRANSACTIONS = gql`
  ${HEADER}
  query GetTransactions(
    $type: TransactionType!
    $searchText: String
    $warehouseId: Int
    $businessPartnerId: Int
    $skip: Int
    $take: Int
    $durationBegin: DateTime
    $durationEnd: DateTime
    $lastUpdated: DateTime
  ) {
    transactions(
      type: $type
      warehouseId: $warehouseId
      businessPartnerId: $businessPartnerId
      skip: $skip
      take: $take
      searchText: $searchText
      durationBegin: $durationBegin
      durationEnd: $durationEnd
      lastUpdated: $lastUpdated
    ) {
      totalCount
      headers {
        ...getHeader
      }
    }
  }
`;
export const GET_INVENTORIES = gql`
  ${GET_ITEM}
  query GetInventories(
    $warehouseId: Int
    $itemId: Int
    $categoryId: Int
    $uomId: Int
    $searchText: String
    $skip: Int
    $take: Int
  ) {
    inventories(
      warehouseId: $warehouseId
      itemId: $itemId
      categoryId: $categoryId
      uomId: $uomId
      skip: $skip
      take: $take
      searchText: $searchText
    ) {
      totalCount
      inventories {
        id
        item {
          ...getItem
        }
        warehouse {
          id
          displayName
        }
        qtyOnHand
        totalPurchaseValue
        totalSaleValue
        totalProfitValue
      }
    }
  }
`;
export const GET_ITEM_INVENTORY = gql`
  ${GET_ITEM}
  query GetItemInventory($id: Int!) {
    getItemInventory(id: $id) {
      id
      item {
        ...getItem
      }
      warehouse {
        id
        displayName
      }
      toWarehouse {
        id
        displayName
      }
      qtyOnHand
    }
  }
`;
export const GET_TRANSACTION_LINES = gql`
  ${HEADER}
  ${LINE}
  query GetLines(
    $headerId: Int
    $searchText: String
    $skip: Int
    $take: Int
    $status: TransactionStatus
  ) {
    lines(
      headerId: $headerId
      skip: $skip
      take: $take
      searchText: $searchText
      status: $status
    ) {
      totalCount
      lines {
        ...getLine
        header {
          ...getHeader
        }
      }
    }
  }
`;
export const GET_LINES = gql`
  ${HEADER}
  ${LINE}
  query GetLines(
    $headerId: Int
    $warehouseId: Int
    $itemId: Int
    $includeSales: Boolean
    $includePurchases: Boolean
    $includePIs: Boolean
    $includeTransfers: Boolean
    $durationBegin: DateTime
    $durationEnd: DateTime
    $searchText: String
    $skip: Int
    $take: Int
    $status: TransactionStatus
    $lastUpdated: DateTime
  ) {
    lines(
      headerId: $headerId
      warehouseId: $warehouseId
      itemId: $itemId
      includeSales: $includeSales
      includePurchases: $includePurchases
      includePIs: $includePIs
      includeTransfers: $includeTransfers
      durationBegin: $durationBegin
      durationEnd: $durationEnd
      skip: $skip
      take: $take
      searchText: $searchText
      status: $status
      lastUpdated: $lastUpdated
    ) {
      totalCount
      lines {
        ...getLine
        header {
          ...getHeader
        }
      }
    }
  }
`;
export const GET_TRANSACTION_PAYMENTS = gql`
  ${HEADER}
  query GetPayments(
    $headerId: Int
    $durationBegin: DateTime
    $durationEnd: DateTime
    $status: PaymentStatus
    $method: PaymentMethods
    $type: PaymentTypes
    $searchText: String
    $skip: Int
    $take: Int
  ) {
    payments(
      headerId: $headerId
      durationBegin: $durationBegin
      durationEnd: $durationEnd
      status: $status
      method: $method
      type: $type
      skip: $skip
      take: $take
      searchText: $searchText
    ) {
      totalCount
      payments {
        id
        amount
        method
        type
        status
        paymentDate
        header {
          ...getHeader
        }
      }
    }
  }
`;

export const GET_SELECTED_HEADER = gql`
  ${HEADER}
  query GetSelectedHeader($id: Int!) {
    getHeaderById(id: $id) {
      ...getHeader
    }
  }
`;
