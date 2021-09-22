import { gql } from "@apollo/client";

export const CREATE_UPDATE_HEADER = gql`
  mutation createUpdateTransaction(
    $type: TransactionType
    $transactionDate: Date
    $id: Int
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
  mutation CreateUpdateLine(
    $id: Int
    $headerId: Int
    $type: TransactionType!
    $transactionDate: DateTime
    $warehouseId: Int
    $businessPartnerId: Int
    $itemId: Int
    $qty: Float
    $eachPrice: Float
    $diff: Float
  ) {
    createUpdateLine(
      input: {
        id: $id
        header: {
          id: $headerId
          type: $type
          transactionDate: $transactionDate
          warehouseId: $warehouseId
          businessPartnerId: $businessPartnerId
        }
        itemId: $itemId
        qty: $qty
        eachPrice: $eachPrice
        diff: $diff
      }
    ) {
      id
      item {
        id
        displayName
      }
      qty
      eachPrice
      diff
      header {
        id
        number
        transactionDate
        status
        numberOfItems
        totalAmount
        totalQty
        warehouse {
          id
          displayName
        }
        businessPartner {
          id
          displayName
        }
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

export const POST_HEADER = gql`
  mutation postHeader($id: Int!) {
    postHeader(id: $id) {
      id
      number
      transactionDate
      status
      numberOfItems
      totalAmount
      totalQty
      warehouse {
        id
        displayName
      }
      businessPartner {
        id
        displayName
      }
      lines {
        id
        item {
          id
          displayName
        }
        qty
        eachPrice
        diff
      }
    }
  }
`;

export const UN_POST_HEADER = gql`
  mutation unPostHeader($id: Int!) {
    unPostHeader(id: $id) {
      id
      number
      transactionDate
      status
      numberOfItems
      totalAmount
      totalQty
      warehouse {
        id
        displayName
      }
      businessPartner {
        id
        displayName
      }
      lines {
        id
        item {
          id
          displayName
        }
        qty
        eachPrice
        diff
      }
    }
  }
`;

export const REMOVE_LINE = gql`
  mutation removeLine($id: Int!) {
    removeLine(id: $id) {
      id
      number
      transactionDate
      numberOfItems
      totalAmount
      totalQty
      warehouse {
        id
        displayName
      }
      businessPartner {
        id
        displayName
      }
    }
  }
`;
