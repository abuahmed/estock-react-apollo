import { gql } from "@apollo/client";

export const GET_SETTING = gql`
  query {
    getSetting {
      id
      lastInventoryUpdated
      lastPIUpdated
      lastPurchaseUpdated
      lastSalesUpdated
      lastItemsUpdated
      lastBusinessPartnersUpdated
    }
  }
`;

// warehouseId
//       warehouse {
//         id
//         displayName
//       }
