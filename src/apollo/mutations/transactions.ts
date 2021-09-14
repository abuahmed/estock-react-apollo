import { gql } from "@apollo/client";

export const CREATE_UPDATE_TRANSACTION_HEADER = gql`
  mutation AddUpdateTransaction(
    $type: TransactionType
    $transactionDate: Date
    $id: Int
    $displayName: String!
    $description: String
    $warehouseId: Int
    $businessPartnerId: Int
  ) {
    createTransaction(
      input: {
        type: $type
        transactionDate: $transactionDate
        id: $id
        warehouseId: $warehouseId
        businessPartnerId: $businessPartnerId
      }
    ) {
      id
      number
      warehouseId
      businessPartner {
        id
        displayName
      }
    }
  }
`;

export const CREATE_UPDATE_TRANSACTION_LINE = gql`
  mutation AddUpdateTransaction(
    $header: TransactionHeader
    $id: Int
    $itemId: Int!
    $quantity: Float!
    $eachPrice: Float
  ) {
    addTransactionLine(
      input: {
        header: $header
        id: $id
        itemId: $itemId
        quantity: $quantity
        eachPrice: $eachPrice
      }
    ) {
      id
      number
      warehouseId
      businessPartner {
        id
        displayName
      }
    }
  }
`;

export const REMOVE_TRANSACTION_HEADER = gql`
  mutation removeHeader($id: Int!) {
    removeHeader(id: $id) {
      affectedRows
    }
  }
`;

export const REMOVE_TRANSACTION_LINE = gql`
  mutation removeLine($id: Int!) {
    removeLine(id: $id) {
      affectedRows
    }
  }
`;
