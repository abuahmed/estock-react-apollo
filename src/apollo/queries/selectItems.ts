import { gql } from "@apollo/client";

export const GET_ALL_ITEMS = gql`
  query GetAllItems {
    getItems(take: -1) {
      id
      displayName
    }
  }
`;

export const GET_ALL_FINANCIAL_ACCOUNTS = gql`
  query GetAllFinancialAccounts {
    getFinancialAccounts(take: -1) {
      id
      bank
      branch
      accountNumber
    }
  }
`;

export const GET_ALL_CATEGORIES = gql`
  query GetCategories($type: CategoryType!) {
    getAllCategories(type: $type, take: -1) {
      id
      type
      displayName
    }
  }
`;
