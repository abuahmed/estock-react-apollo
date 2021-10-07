import { gql } from "@apollo/client";

export const GET_ALL_BUSINESS_PARTNERS = gql`
  query GetBusinessPartners($type: BusinessPartnerType!) {
    businessPartners(type: $type) {
      id
      displayName
      description
      type
      initialOutstandingCredit
      creditLimit
      creditTransactionsLimit
      address {
        id
        mobile
        telephone
        email
      }
      contact {
        id
        fullName
        address {
          id
          mobile
          telephone
          email
        }
      }
    }
  }
`;

export const GET_SELECTED_BUSINESS_PARTNER = gql`
  query GetSelectedBusinessPartner($id: Int!) {
    getBusinessPartner(id: $id) {
      id
      displayName
      description
      type
      initialOutstandingCredit
      creditLimit
      creditTransactionsLimit
      address {
        id
        mobile
        telephone
        email
      }
      contact {
        id
        fullName
        address {
          id
          mobile
          telephone
          email
        }
      }
    }
  }
`;