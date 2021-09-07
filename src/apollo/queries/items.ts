import { gql } from "@apollo/client";

export const GET_ALL_ITEMS = gql`
  query GetItems {
    items {
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

export const GET_ALL_ITEM_CATEGORIES = gql`
  query GetItemCategories {
    getItemCategories {
      id
      displayName
    }
  }
`;

export const GET_ALL_ITEM_UOMS = gql`
  query GetItemUoms {
    getItemUoms {
      id
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
