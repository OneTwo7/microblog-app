import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';
import { NextPageContext } from 'next';
import { cookies } from 'next/headers';

export const { getClient } = registerApolloClient(() => {
  const appCookies = cookies();
  const qid = appCookies.get('qid');
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: 'http://localhost:4000/graphql',
    }),
    credentials: 'include',
    headers: {
      cookie: qid ? `${qid.name}=${encodeURIComponent(qid.value)}` : '',
    },
  });
});
