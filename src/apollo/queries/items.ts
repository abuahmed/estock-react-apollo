import { gql } from "@apollo/client";

export const GET_ALL_ITEMS = gql`
  query GetItems {
    items {
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
  }
`;

export const GET_ALL_CATEGORIES = gql`
  query GetCategories($type: CategoryType!) {
    getCategories(type: $type) {
      id
      type
      displayName
    }
  }
`;

export const GET_SELECTED_ITEM = gql`
  query GetSelectedItem($id: Int!) {
    getItem(id: $id) {
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
  }
`;
