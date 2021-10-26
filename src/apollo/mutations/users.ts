import { gql } from "@apollo/client";

export const SIGN_IN = gql`
  mutation Login($email: String!, $password: String!) {
    authUser(input: { email: $email, password: $password }) {
      id
      name
      email
      avatar
      isAdmin
      token
      roles {
        id
        displayName
      }
      warehouses {
        id
        displayName
      }
      client {
        id
        displayName
      }
    }
  }
`;
export const FORGOT_PASSWORD = gql`
  mutation forgotPassword($email: String!) {
    forgotPassword(input: { email: $email }) {
      id
      name
      email
      avatar
    }
  }
`;
export const CHANGE_PASSWORD = gql`
  mutation ChangePassword(
    $userId: Int!
    $oldPassword: String!
    $password: String!
    $confirmPassword: String!
  ) {
    changePassword(
      input: {
        userId: $userId
        oldPassword: $oldPassword
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      name
      email
      avatar
    }
  }
`;
export const RESET_USER_PASSWORD = gql`
  mutation ResetUserPassword(
    $id: Int!
    $token: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetUserPassword(
      input: {
        id: $id
        token: $token
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      name
      email
      avatar
    }
  }
`;

export const SIGN_UP_FEDERATED_USER = gql`
  mutation RegisterFederatedUser($email: String, $clientId: Int) {
    registerFederatedUser(input: { email: $email, clientId: $clientId }) {
      id
      name
      email
      avatar
      isAdmin
      token
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

export const SIGN_IN_GOOGLE = gql`
  mutation Login($idToken: String!) {
    googleLogin(input: { idToken: $idToken }) {
      id
      name
      email
      avatar
      isAdmin
      token
      roles {
        id
        displayName
      }
      warehouses {
        id
        displayName
      }
      client {
        id
        displayName
      }
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
      roles {
        id
        displayName
      }
      warehouses {
        id
        displayName
      }
      client {
        id
        displayName
      }
    }
  }
`;

export const ADD_USER_ROLES = gql`
  mutation addUserRoles($ids: [Int!]!) {
    addUserRoles(input: { ids: $ids }) {
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
export const ADD_USER_WAREHOUSES = gql`
  mutation addUserWarehouses($ids: [Int!]!) {
    addUserWarehouses(input: { ids: $ids }) {
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
