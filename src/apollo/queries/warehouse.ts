import { gql } from "@apollo/client";

export const GET_ALL_CLIENTS = gql`
  query GetClients($searchText: String, $skip: Int, $take: Int) {
    clients(skip: $skip, take: $take, searchText: $searchText) {
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

export const GET_SELECTED_CLIENT = gql`
  query GetSelectedClient($id: Int!) {
    getClient(id: $id) {
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

export const GET_ALL_ORGANIZATIONS = gql`
  query GetOrganizations(
    $clientId: Int!
    $searchText: String
    $skip: Int
    $take: Int
  ) {
    organizations(
      clientId: $clientId
      skip: $skip
      take: $take
      searchText: $searchText
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

export const GET_SELECTED_ORGANIZATION = gql`
  query GetSelectedOrganization($id: Int!) {
    getOrganization(id: $id) {
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

export const GET_ALL_WAREHOUSES = gql`
  query GetWarehouses(
    $parent: String
    $parentId: Int!
    $searchText: String
    $skip: Int
    $take: Int
  ) {
    warehouses(
      parent: $parent
      parentId: $parentId
      skip: $skip
      take: $take
      searchText: $searchText
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
        clientId
      }
    }
  }
`;

// export const GET_ALL_WAREHOUSES = gql`
//   query GetWarehouses($organizationId: Int!) {
//     warehouses(organizationId: $organizationId) {
//       id
//       displayName
//       description
//       addressId
//       address {
//         id
//         mobile
//         telephone
//         email
//       }
//       organizationId
//       organization {
//         id
//         displayName
//         clientId
//       }
//     }
//   }
// `;

export const GET_SELECTED_WAREHOUSE = gql`
  query GetSelectedWarehouse($id: Int!) {
    getWarehouse(id: $id) {
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
        clientId
      }
    }
  }
`;
