import { gql } from "@apollo/client";
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
      durationEnd: "2021-12-11"
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
      durationEnd: "2021-10-11"
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
    $skip: Int
    $take: Int
    $durationBegin: DateTime
    $durationEnd: DateTime
    $lastUpdated: DateTime
  ) {
    transactions(
      type: $type
      skip: $skip
      take: $take
      searchText: $searchText
      durationBegin: $durationBegin
      durationEnd: $durationEnd
      lastUpdated: $lastUpdated
    ) {
      totalTransactions
      totalAmount
      headers {
        ...getHeader
      }
    }
  }
`;
export const GET_INVENTORIES = gql`
  query GetInventories($lastUpdated: DateTime) {
    inventories(lastUpdated: $lastUpdated) {
      id
      item {
        id
        displayName
        itemCategory {
          id
          displayName
        }
        unitOfMeasure {
          id
          displayName
        }
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
`;
export const GET_ITEM_INVENTORY = gql`
  query GetItemInventory($id: Int!) {
    getItemInventory(id: $id) {
      id
      item {
        id
        displayName
        itemCategory {
          id
          displayName
        }
        unitOfMeasure {
          id
          displayName
        }
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
    $itemId: Int
    $includeSales: Boolean
    $includePurchases: Boolean
    $includePIs: Boolean
    $includeTransfers: Boolean
    $durationBegin: DateTime
    $durationEnd: DateTime
    $status: TransactionStatus
    $lastUpdated: DateTime
  ) {
    lines(
      headerId: $headerId
      itemId: $itemId
      includeSales: $includeSales
      includePurchases: $includePurchases
      includePIs: $includePIs
      includeTransfers: $includeTransfers
      durationBegin: $durationBegin
      durationEnd: $durationEnd
      status: $status
      lastUpdated: $lastUpdated
    ) {
      ...getLine
      header {
        ...getHeader
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
  ) {
    payments(
      headerId: $headerId
      durationBegin: $durationBegin
      durationEnd: $durationEnd
      status: $status
      method: $method
      type: $type
    ) {
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
`;

export const GET_SELECTED_HEADER = gql`
  ${HEADER}
  query GetSelectedHeader($id: Int!) {
    getHeaderById(id: $id) {
      ...getHeader
    }
  }
`;

// export const GET_SELECTED_LINE = gql`
//   query GetSelectedLine($id: Int!) {
//     getSelectedLine(id: $id) {
//       itemId
//       item{
//         id
//         displayName
//       }
//       qty
//       eachPrice
//       header :{id
//       transactionDate
//       number
//       numberOfItems
//       totalQty
//       totalAmount
//       warehouseId
//       warehouse {
//         id
//         displayName
//       }
//       businessPartnerId
//       businessPartner {
//         id
//         displayName
//       }}
//     }
//   }
// `;
