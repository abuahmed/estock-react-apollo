import { gql } from "@apollo/client";
import { GET_FINANCIAL_ACCOUNT, GET_ITEM } from "../fragments/items";
export const REMOVE_ITEM = gql`
  mutation removeAnItem($id: Int!) {
    removeItem(id: $id) {
      affectedRows
    }
  }
`;
export const REMOVE_FINANCIAL_ACCOUNT = gql`
  mutation removeAnFinancialAccount($id: Int!) {
    removeFinancialAccount(id: $id) {
      affectedRows
    }
  }
`;

export const ADD_UPDATE_ITEM = gql`
  ${GET_ITEM}

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
      ...getItem
    }
  }
`;
export const ADD_UPDATE_FINANCIAL_ACCOUNT = gql`
  ${GET_FINANCIAL_ACCOUNT}
  mutation AddUpdateFinancialAccount(
    $id: Int
    $accountNumber: String!
    $branch: String
    $bankId: Int
    $organizationId: Int
    $businessPartnerId: Int
    $accountFormat: String
    $iban: String
    $swiftCode: String
    $country: String
  ) {
    createFinancialAccount(
      input: {
        id: $id
        accountNumber: $accountNumber
        bank: { id: $bankId }
        organizationId: $organizationId
        businessPartnerId: $businessPartnerId
        accountFormat: $accountFormat
        iban: $iban
        swiftCode: $swiftCode
        country: $country
      }
    ) {
      ...getFinancialAccount
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
  mutation removeCategory($id: Int!) {
    removeCategory(id: $id) {
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
