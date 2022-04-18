import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink, gql, useQuery } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import React, { useRef } from 'react';
import { getAccessToken } from "util/auth";

const createClient = ({ onLoggedOut }) => {
  const authLink = setContext(async (_, { headers }) => ({
    headers: {
      ...headers,
      authorization: `Bearer ${await getAccessToken()}`,
    }
  }));

  const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors) {
      for (const error of graphQLErrors) {
        if (error.extensions.code === 'UNAUTHENTICATED') {
          onLoggedOut();
          return;
        }
      }
    }
  });

  const httpLink = createHttpLink({
    uri: '/graphql',
    credentials: 'include',
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(errorLink).concat(httpLink)
  });
}

const ASD = () => {
  const { loading, error, data } = useQuery(gql`
    query Author {
      author {
        id
      }
    }
  `);
  if (loading) return "loading...";
  if (error) return error.message;
  return JSON.stringify(data);
}

export default () => {
  const onLoggedOut = () => {};

  return (
    <ApolloProvider client={useRef(createClient({ onLoggedOut })).current}>
      <ASD/>
    </ApolloProvider>
  );
};