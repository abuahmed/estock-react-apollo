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

export const GET_SELECTED_USER = gql`
  query GetUser($id: ID!) {
    User(input: { id: $id }) {
      name
      email
      avatar
      roles {
        id
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
