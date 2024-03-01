import { withApollo } from 'next-apollo';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { NextPageContext } from 'next';
import { isServer } from './isServer';

function createClient(ctx?: NextPageContext) {
  return new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache(),
    credentials: 'include',
    headers: {
      cookie: (isServer() ? ctx?.req?.headers.cookie : undefined) || '',
    },
  });
}

export default withApollo(createClient);
