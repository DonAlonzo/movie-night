import React, { useRef } from 'react'
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import { Container } from 'react-bootstrap';
import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from "@apollo/client/link/error";
import { AuthenticationProvider, useAuthenticationContext } from 'contexts/authentication';
import style from './index.module.css';

import Login from 'components/login';

const createApolloClient = ({ logout }) => {
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      for (const error of graphQLErrors) {
        switch (error.extensions.code) {
          case 'UNAUTHENTICATED': {
            logout();
            return;
          }
          default: {
            console.error(`[GraphQL error]: ${error.message}`)
          }
        }
      }
    }
    if (networkError) {
      console.error(`[Network error]: ${networkError.message}`);
    }
  });

  const httpLink = new HttpLink({
    uri: `/api/graphql`
  });

  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: localStorage.getItem("token") !== null ? `Bearer ${localStorage.getItem("token")}` : undefined,
    }
  }));

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([
      authLink,
      errorLink,
      httpLink
    ])
  });
}

const App = () => {
  const { isLoggedIn, logout } = useAuthenticationContext();
  return (
    <ApolloProvider client={useRef(createApolloClient({ logout })).current}>
      <Router>
        {isLoggedIn ? <Session/> : <Login/>}
      </Router>
    </ApolloProvider>
  );
};

const Session = () => {
  return (
    <Container>
      :D
    </Container>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <AuthenticationProvider>
      <App/>
    </AuthenticationProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
