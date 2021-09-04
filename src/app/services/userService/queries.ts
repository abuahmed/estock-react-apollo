import { gql } from "@apollo/client";

export const GET_ALL_Users = gql`
  query GetUsers {
    Users {
      id
      name
      email
      avatar
    }
  }
`;

export const GET_ALL_Roles = gql`
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
      name
      email
      avatar
      roles {
        id
        displayName
      }
    }
  }
`;

export const PROFILE = gql`
  query GetUserProfile($id: Number!) {
    getUserProfile(input: { id: $id }) {
      name
      email
      avatar
      roles {
        id
      }
    }
  }
`;
