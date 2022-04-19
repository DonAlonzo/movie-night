import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink, gql, useMutation, useQuery } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import React, { useRef } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
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

const WATCHING_QUERY = gql`
  query Watchings {
    watchings {
      _id
    }
  }
`;

const CREATE_WATCHING_MUTATION = gql`
  mutation CreateWatching($movie: ID!) {
    createWatching(movie: $movie) {
      _id
    }
  }
`;

const CREATE_MOVIE_MUTATION = gql`
  mutation CreateMovie($imdb: String) {
    createMovie(imdb: $imdb) {
      _id
    }
  }
`;

const CreateWatchingButton = () => {
  const [createWatching, { loading, error }] = useMutation(CREATE_WATCHING_MUTATION, { refetchQueries: [WATCHING_QUERY] });
  if (loading) return "loading...";
  if (error) return error.message;
  const handleClick = () => {
    createWatching({
      variables: {
        movie: "movie_id"
      }
    });
  };
  return (
    <Button type='submit' onClick={handleClick}>
      Create new watching
    </Button>
  );
}

const Watchings = () => {
  const { loading, error, data } = useQuery(WATCHING_QUERY);
  if (loading) return "loading...";
  if (error) return error.message;
  return (
    <>
      <ListGroup>
        {data.watchings.map(watching => (
          <ListGroup.Item>{watching._id}</ListGroup.Item>
        ))}
      </ListGroup>
      <CreateWatchingButton/>
    </>
  );
}

export default () => {
  const onLoggedOut = () => {};

  return (
    <ApolloProvider client={useRef(createClient({ onLoggedOut })).current}>
      <Watchings/>
    </ApolloProvider>
  );
};