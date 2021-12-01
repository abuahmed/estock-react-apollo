import { gql } from "@apollo/client";
import { GET_FINANCIAL_ACCOUNT, GET_ITEM } from "../fragments/items";

export const GET_ITEMS = gql`
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
      totalCount
      items {
        ...getItem
      }
    }
  }
`;

export const GET_FINANCIAL_ACCOUNTS = gql`
  ${GET_FINANCIAL_ACCOUNT}
  query GetFinancialAccounts(
    $bankId: Int
    $organizationId: Int
    $businessPartnerId: Int
    $searchText: String
    $skip: Int
    $take: Int
  ) {
    financialAccounts(
      bankId: $bankId
      organizationId: $organizationId
      businessPartnerId: $businessPartnerId
      skip: $skip
      take: $take
      searchText: $searchText
    ) {
      ...getFinancialAccount
    }
  }
`;

export const GET_CATEGORIES = gql`
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

export const GET_SELECTED_FINANCIAL_ACCOUNT = gql`
  ${GET_FINANCIAL_ACCOUNT}
  query GetSelectedFinancialAccount($id: Int!) {
    getFinancialAccount(id: $id) {
      ...getFinancialAccount
    }
  }
`;
