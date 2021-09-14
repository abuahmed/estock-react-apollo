import { gql } from "@apollo/client";

export const GET_ALL_TRANSACTIONS = gql`
  query GetTransactions($type: TransactionType!) {
    transactions(type: $type) {
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
export const GET_TRANSACTION_LINES = gql`
  query GetLines($headerId: Int!) {
    lines(headerId: $headerId) {
      id
      item {
        id
        displayName
      }
      qty
      eachPrice
    }
  }
`;

// export const GET_SELECTED_HEADER = gql`;
//   query GetSelectedHeader($id: Int!) {
//     getSelectedHeader(id: $id) {
//       id
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
//       }
//     }
//   }
// `;

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
