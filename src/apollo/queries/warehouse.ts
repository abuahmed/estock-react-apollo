import { gql } from "@apollo/client";

export const GET_ALL_CLIENTS = gql`
  query GetOrganizations {
    clients {
      id
      displayName
      description
      type

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
      type

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
  query GetOrganizations($clientId: Int!) {
    organizations(clientId: $clientId) {
      id
      displayName
      description

      address {
        id
        mobile
        telephone
        email
      }

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

      address {
        id
        mobile
        telephone
        email
      }

      client {
        id
        displayName
      }
    }
  }
`;

export const GET_ALL_WAREHOUSES = gql`
  query GetWarehouses($organizationId: Int!) {
    warehouses(organizationId: $organizationId) {
      id
      displayName
      description

      address {
        id
        mobile
        telephone
        email
      }

      organization {
        id
        displayName
      }
    }
  }
`;

export const GET_SELECTED_WAREHOUSE = gql`
  query GetSelectedWarehouse($id: Int!) {
    getWarehouse(id: $id) {
      id
      displayName
      description

      address {
        id
        mobile
        telephone
        email
      }

      client {
        id
        displayName
      }
    }
  }
`;
