import { gql } from "@apollo/client";
import { GET_ITEM } from "../fragments/items";

export const GET_ALL_ITEMS = gql`
  ${GET_ITEM}
  query GetItems($searchText: String, $skip: Int, $take: Int) {
    items(skip: $skip, take: $take, searchText: $searchText) {
      ...getItem
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
  ${GET_ITEM}
  query GetSelectedItem($id: Int!) {
    getItem(id: $id) {
      ...getItem
    }
  }
`;
