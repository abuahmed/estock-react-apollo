import { gql } from "@apollo/client";
export const HEADER = gql`
  fragment getHeader on TransactionHeader {
    id
    type
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
    toWarehouseId
    toWarehouse {
      id
      displayName
    }
    businessPartnerId
    businessPartner {
      id
      displayName
    }
  }
`;
export const LINE = gql`
  fragment getLine on TransactionLine {
    id
    item {
      id
      displayName
    }
    qty
    eachPrice
    diff
    linePrice
  }
`;
