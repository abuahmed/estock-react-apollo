import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
//import { selectAuth } from "../features/auth/authSlice";
//import { useAppSelector } from "./hooks";
//uri: `https://server.pinnasofts.com/graphql` as any,

const httpLink = createHttpLink({
  uri: `http://localhost:5500/graphql` as any,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  // return the headers to the context so httpLink can read them
  //const { user } = useAppSelector(selectAuth);
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// import { ApolloClient, InMemoryCache } from "@apollo/client";

// //uri: `${process.env.REACT_APP_API_URL}/graphql` as any,
// export const apolloClient = new ApolloClient({
//     uri: `http://localhost:5500/graphql` as any,
//     cache: new InMemoryCache(),
// });
