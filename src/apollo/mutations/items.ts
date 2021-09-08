import { gql } from "@apollo/client";

// interface ItemInput {
//   id: !Int;
//   displayName: String;
//   description: String;
//   code: String;
//   purchasePrice: Float;
//   sellingPrice: Float;
//   safeQty: Float;
// }
export const REMOVE_ITEM = gql`
  mutation removeAnItem($id: Int!) {
    removeItem(id: $id) {
      affectedRows
    }
  }
`;

export const ADD_UPDATE_ITEM = gql`
  mutation AddUpdateItem(
    $id: Int
    $displayName: String!
    $description: String
    $code: String
    $purchasePrice: Float
    $sellingPrice: Float
    $safeQty: Float
  ) {
    createItem(
      input: {
        id: $id
        displayName: $displayName
        description: $description
        code: $code
        purchasePrice: $purchasePrice
        sellingPrice: $sellingPrice
        safeQty: $safeQty
      }
    ) {
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
