import { gql } from "@apollo/client";
import { HEADER, LINE } from "../fragments/transaction";

export const CREATE_UPDATE_HEADER = gql`
  ${HEADER}
  mutation createUpdateTransaction(
    $type: TransactionType!
    $transactionDate: DateTime
    $id: Int
    $warehouseId: Int
    $toWarehouseId: Int
    $businessPartnerId: Int
  ) {
    createTransaction(
      input: {
        type: $type
        transactionDate: $transactionDate
        id: $id
        warehouseId: $warehouseId
        toWarehouseId: $toWarehouseId
        businessPartnerId: $businessPartnerId
      }
    ) {
      ...getHeader
    }
  }
`;

export const CREATE_UPDATE_LINE = gql`
  ${HEADER}
  ${LINE}
  mutation CreateUpdateLine(
    $id: Int
    $headerId: Int
    $type: TransactionType!
    $transactionDate: DateTime
    $warehouseId: Int
    $toWarehouseId: Int
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
          toWarehouseId: $toWarehouseId
          businessPartnerId: $businessPartnerId
        }
        itemId: $itemId
        qty: $qty
        eachPrice: $eachPrice
        diff: $diff
      }
    ) {
      ...getLine
      header {
        ...getHeader
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
  ${HEADER}
  ${LINE}
  mutation postHeader2($id: Int!) {
    postHeader(id: $id) {
      ...getHeader
      lines {
        ...getLine
      }
    }
  }
`;

export const UN_POST_HEADER = gql`
  ${HEADER}
  ${LINE}
  mutation unPostHeader($id: Int!) {
    unPostHeader(id: $id) {
      ...getHeader
      lines {
        ...getLine
      }
    }
  }
`;

export const POST_HEADER_WITH_PAYMENT = gql`
  ${HEADER}
  ${LINE}
  mutation postHeader(
    $headerId: Int
    $type: PaymentTypes
    $paymentDate: DateTime
    $amount: Float
    $amountRequired: Float
  ) {
    postHeaderWithPayment(
      input: {
        type: $type
        headerId: $headerId
        paymentDate: $paymentDate
        amount: $amount
        amountRequired: $amountRequired
      }
    ) {
      ...getHeader
      lines {
        ...getLine
      }
    }
  }
`;

export const REMOVE_LINE = gql`
  ${HEADER}
  mutation removeLine($id: Int!) {
    removeLine(id: $id) {
      ...getHeader
    }
  }
`;
