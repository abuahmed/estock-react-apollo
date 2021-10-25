import { gql } from "@apollo/client";

export const GET_ALL_USERS = gql`
  query GetUsers {
    Users {
      id
      name
      email
      avatar
      roles {
        id
        displayName
      }
      warehouses {
        id
        displayName
      }
    }
  }
`;

export const GET_ALL_ROLES = gql`
  query GetRoles {
    GetRoles {
      id
      displayName
    }
  }
`;

export const GET_SELECTED_USER = gql`
  query GetSelectedUser($id: Int!) {
    GetUser(input: { id: $id }) {
      id
      name
      email
      avatar
      roles {
        id
        displayName
      }
      warehouses {
        id
        displayName
      }
    }
  }
`;
