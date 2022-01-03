import { gql } from "@apollo/client";

export const REMOVE_BUSINESS_PARTNER = gql`
  mutation RemoveBusinessPartner($id: Int!) {
    removeBusinessPartner(id: $id) {
      affectedRows
    }
  }
`;

// export const ADD_UPDATE_BUSINESS_PARTNER = gql`
//   mutation CreateBusinessPartner(
//     $type: BusinessPartnerType!
//     $displayName: String
//     $address: Address!
//     $contact: Contact!
//   ) {
//     createBusinessPartner(
//       input: {
//         displayName: $displayName
//         type: $type
//         address: $address
//         contact: $contact
//       }
//     ) {
//       id
//       displayName
//       type
//       address {
//         id
//         mobile
//         telephone
//         email
//       }
//       contact {
//         id
//         fullName
//         address {
//           id
//           mobile
//           telephone
//           email
//         }
//       }
//     }
//   }
// `;

export const ADD_UPDATE_BUSINESS_PARTNER = gql`
  mutation CreateBusinessPartner(
    $id: Int
    $type: BusinessPartnerType!
    $displayName: String
    $initialOutstandingCredit: Float
    $creditLimit: Float
    $creditTransactionsLimit: Int
    $addressId: Int
    $mobile: String
    $telephone: String
    $email: String
    $contactId: Int
    $fullName: String!
    $contactAddressId: Int
    $contactMobile: String
    $contactTelephone: String
    $contactEmail: String
  ) {
    createBusinessPartner(
      input: {
        id: $id
        displayName: $displayName
        initialOutstandingCredit: $initialOutstandingCredit
        creditLimit: $creditLimit
        creditTransactionsLimit: $creditTransactionsLimit
        type: $type
        address: {
          id: $addressId
          mobile: $mobile
          telephone: $telephone
          email: $email
        }
        contact: {
          id: $contactId
          fullName: $fullName
          address: {
            id: $contactAddressId
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
