import { gql } from "@apollo/client";

export const GET_ALL_Users = gql`
  query GetUsers {
    Users {
      id
      name
      email
    }
  }
`;

// export const PROFILE = gql`
//   query GetProfile($id: Number!) {
//     getUserProfile(input: { id: $id }) {
//       name
//       email
//     }
//   }
// `;
