import { gql } from "@apollo/client";

export const SIGN_IN = gql`
  mutation Login($email: String!, $password: String!) {
    authUser(input: { email: $email, password: $password }) {
      id
      name
      email
      isAdmin
      token
    }
  }
`;

export const SIGN_IN_GOOGLE = gql`
  mutation Login($idToken: String!) {
    googleLogin(input: { idToken: $idToken }) {
      id
      name
      email
      isAdmin
      token
    }
  }
`;

export const SIGN_IN_FACEBOOK = gql`
  mutation Login($userID: String!, $accessToken: String!) {
    facebookLogin(input: { userID: $userID, accessToken: $accessToken }) {
      id
      name
      email
      isAdmin
      token
    }
  }
`;
