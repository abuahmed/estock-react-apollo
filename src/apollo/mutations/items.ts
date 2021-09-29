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
    $itemCategoryId: Int
    $unitOfMeasureId: Int
    $purchasePrice: Float
    $sellingPrice: Float
    $safeQty: Float
  ) {
    createItem(
      input: {
        id: $id
        displayName: $displayName
        description: $description
        itemCategory: { id: $itemCategoryId }
        unitOfMeasure: { id: $unitOfMeasureId }
        purchasePrice: $purchasePrice
        sellingPrice: $sellingPrice
        safeQty: $safeQty
      }
    ) {
      id
      displayName
      description

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

export const ADD_UPDATE_ITEM_CATEGORY = gql`
  mutation AddUpdateItemCategory(
    $id: Int
    $displayName: String
    $type: CategoryType
  ) {
    createItemCategory(
      input: { id: $id, displayName: $displayName, type: $type }
    ) {
      id
      displayName
    }
  }
`;

export const ADD_UPDATE_ITEM_UOM = gql`
  mutation AddUpdateItemUom($id: Int, $displayName: String) {
    createItemUom(input: { id: $id, displayName: $displayName }) {
      id
      displayName
    }
  }
`;

export const REMOVE_CATEGORY = gql`
  mutation removeItemCategory($id: Int!) {
    removeItemCategory(id: $id) {
      affectedRows
    }
  }
`;

export const REMOVE_UOM = gql`
  mutation removeItemUom($id: Int!) {
    removeItemUom(id: $id) {
      affectedRows
    }
  }
`;
