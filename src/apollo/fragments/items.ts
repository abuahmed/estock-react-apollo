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

export const GET_FINANCIAL_ACCOUNT = gql`
  fragment getFinancialAccount on FinancialAccount {
    id
    branch
    accountNumber
    accountFormat
    iban
    swiftCode
    country
    bankId
    bank {
      id
      displayName
    }
  }
`;
