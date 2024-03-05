import { AUTH_COOKIE_NAME } from '@/constants';
import { ApolloClient, HttpLink, HttpOptions, InMemoryCache } from '@apollo/client';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';
import { cookies } from 'next/headers';

export const { getClient } = registerApolloClient(() => {
  const authCookie = cookies().get(AUTH_COOKIE_NAME);
  const httpOptions: HttpOptions = {
    uri: 'http://localhost:4000/graphql',
    credentials: 'include',
  };

  if (authCookie) {
    httpOptions.headers = {
      cookie: `${authCookie.name}=${encodeURIComponent(authCookie.value)}`,
    };
  }

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink(httpOptions),
  });
});
