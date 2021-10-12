import { gql } from "@apollo/client";

export const ADD_UPDATE_CLIENT = gql`
  mutation CreateClient(
    $id: Int
    $displayName: String
    $addressId: Int
    $mobile: String
    $telephone: String
    $email: String
  ) {
    createUpdateClient(
      input: {
        id: $id
        displayName: $displayName
        address: {
          id: $addressId
          mobile: $mobile
          telephone: $telephone
          email: $email
        }
      }
    ) {
      id
      displayName
      description
      address {
        id
        mobile
        telephone
        email
      }
    }
  }
`;

export const REMOVE_CLIENT = gql`
  mutation removeClient($id: Int!) {
    removeClient(id: $id) {
      affectedRows
    }
  }
`;

export const ADD_UPDATE_ORGANIZATION = gql`
  mutation CreateOrganization(
    $id: Int
    $clientId: Int!
    $displayName: String
    $addressId: Int
    $mobile: String
    $telephone: String
    $email: String
  ) {
    createUpdateOrganization(
      input: {
        id: $id
        clientId: $clientId
        displayName: $displayName
        address: {
          id: $addressId
          mobile: $mobile
          telephone: $telephone
          email: $email
        }
      }
    ) {
      id
      displayName
      description
      addressId
      address {
        id
        mobile
        telephone
        email
      }
      clientId
      client {
        id
        displayName
      }
    }
  }
`;

export const REMOVE_ORGANIZATION = gql`
  mutation removeOrganization($id: Int!) {
    removeOrganization(id: $id) {
      affectedRows
    }
  }
`;

export const ADD_UPDATE_WAREHOUSE = gql`
  mutation CreateWarehouse(
    $id: Int
    $organizationId: Int!
    $displayName: String
    $addressId: Int
    $mobile: String
    $telephone: String
    $email: String
  ) {
    createUpdateWarehouse(
      input: {
        id: $id
        organizationId: $organizationId
        displayName: $displayName
        address: {
          id: $addressId
          mobile: $mobile
          telephone: $telephone
          email: $email
        }
      }
    ) {
      id
      displayName
      description
      addressId
      address {
        id
        mobile
        telephone
        email
      }
      organizationId
      organization {
        id
        displayName
      }
    }
  }
`;

export const REMOVE_WAREHOUSE = gql`
  mutation removeWarehouse($id: Int!) {
    removeWarehouse(id: $id) {
      affectedRows
    }
  }
`;
