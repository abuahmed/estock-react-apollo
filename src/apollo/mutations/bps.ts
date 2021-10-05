import { gql } from "@apollo/client";

export const REMOVE_BUSINESS_PARTNER = gql`
  mutation RemoveBusinessPartner($id: Int!) {
    removeBusinessPartner(id: $id) {
      affectedRows
    }
  }
`;

export const ADD_UPDATE_BUSINESS_PARTNER = gql`
  mutation CreateBusinessPartner(
    $type: BusinessPartnerType!
    $displayName: String!
    $mobile: String
    $telephone: String
    $email: String
    $fullName: String!
    $contactMobile: String
    $contactTelephone: String
    $contactEmail: String
  ) {
    createBusinessPartner(
      input: {
        displayName: $displayName
        type: $type
        address: { mobile: $mobile, telephone: $telephone, email: $email }
        contact: {
          fullName: $fullName
          address: {
            mobile: $contactMobile
            telephone: $contactTelephone
            email: $contactEmail
          }
        }
      }
    ) {
      id
      displayName
      type
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
