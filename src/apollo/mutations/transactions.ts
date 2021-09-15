import { gql } from "@apollo/client";

export const CREATE_UPDATE_HEADER = gql`
  mutation createUpdateTransaction(
    $type: TransactionType
    $transactionDate: Date
    $id: Int
    $displayName: String!
    $description: String
    $warehouseId: Int
    $businessPartnerId: Int
  ) {
    createUpdateHeader(
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

export const CREATE_UPDATE_LINE = gql`
  mutation CreateUpdateTransaction {
    createUpdateLine(
      input: { headerId: 16, itemId: 112, qty: 11, eachPrice: 22 }
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

export const REMOVE_HEADER = gql`
  mutation removeHeader($id: Int!) {
    removeHeader(id: $id) {
      affectedRows
    }
  }
`;

export const REMOVE_LINE = gql`
  mutation removeLine($id: Int!) {
    removeLine(id: $id) {
      affectedRows
    }
  }
`;
