import { gql } from "@apollo/client";
import { Item } from "../../features/items/types/itemType";
export const ADD_UPDATE_ITEM = gql`
  mutation AddUpdateItem($item: Item!) {
    createItem(input: $item) {
      id
      displayName
      description
      code
      pictureUrl
      itemCategory {
        id
        displayName
      }
      unitOfMeasure {
        id
        displayName
      }
      purchasePrice
      sellingPrice
      safeQty
    }
  }
`;
