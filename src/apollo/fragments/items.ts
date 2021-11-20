import { gql } from "@apollo/client";
export const GET_ITEM = gql`
  fragment getItem on Item {
    id
    displayName
    description
    pictureUrl
    itemCategoryId
    itemCategory {
      id
      displayName
    }
    unitOfMeasureId
    unitOfMeasure {
      id
      displayName
    }
    purchasePrice
    sellingPrice
    safeQty
  }
`;
