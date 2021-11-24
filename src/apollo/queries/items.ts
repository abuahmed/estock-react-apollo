import { gql } from "@apollo/client";
import { GET_ITEM } from "../fragments/items";

export const GET_ALL_ITEMS = gql`
  ${GET_ITEM}
  query GetItems(
    $itemId: Int
    $categoryId: Int
    $uomId: Int
    $searchText: String
    $skip: Int
    $take: Int
  ) {
    items(
      itemId: $itemId
      categoryId: $categoryId
      uomId: $uomId
      skip: $skip
      take: $take
      searchText: $searchText
    ) {
      ...getItem
    }
  }
`;

export const GET_ALL_CATEGORIES = gql`
  query GetCategories(
    $type: CategoryType!
    $searchText: String
    $skip: Int
    $take: Int
  ) {
    getCategories(
      type: $type
      skip: $skip
      take: $take
      searchText: $searchText
    ) {
      id
      type
      displayName
    }
  }
`;

export const GET_SELECTED_ITEM = gql`
  ${GET_ITEM}
  query GetSelectedItem($id: Int!) {
    getItem(id: $id) {
      ...getItem
    }
  }
`;
