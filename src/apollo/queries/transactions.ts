import { gql } from "@apollo/client";

export const GET_ALL_TRANSACTIONS = gql`
  query GetTransactions(
    $type: TransactionType!
    $durationBegin: DateTime
    $durationEnd: DateTime
  ) {
    transactions(
      type: $type
      durationBegin: $durationBegin
      durationEnd: $durationEnd
    ) {
      id
      transactionDate
      number
      status
      numberOfItems
      totalQty
      totalAmount
      warehouseId
      warehouse {
        id
        displayName
      }
      businessPartnerId
      businessPartner {
        id
        displayName
      }
    }
  }
`;
export const GET_INVENTORIES = gql`
  query GetInventories($lastUpdated: DateTime) {
    inventories {
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
      qtyOnHand
    }
  }
`;
export const GET_TRANSACTION_LINES = gql`
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
    ) {
      id
      item {
        id
        displayName
      }
      header {
        id
        type
        transactionDate
        number
        status
        warehouse {
          displayName
        }
        businessPartner {
          displayName
        }
      }
      qty
      eachPrice
      diff
    }
  }
`;

export const GET_SELECTED_HEADER = gql`
  query GetSelectedHeader($id: Int!) {
    getHeaderById(id: $id) {
      id
      transactionDate
      number
      numberOfItems
      totalQty
      totalAmount
      warehouseId
      warehouse {
        id
        displayName
      }
      businessPartnerId
      businessPartner {
        id
        displayName
      }
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
