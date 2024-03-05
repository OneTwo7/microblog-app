'use client';
import NextLink from 'next/link';
import { Button, Typography } from '@mui/material';
import { User, useLogoutMutation } from '@/gql/graphql';
import { useApolloClient } from '@apollo/client';
import { useRouter } from 'next/navigation';

type LoginButtonProps = {
  isMenu: boolean;
  isLoading: boolean;
  currentUser?: Partial<User> | null;
  onClick: () => void;
};

export default function LoginButton({ isMenu, isLoading, currentUser, onClick }: LoginButtonProps) {
  const apolloClient = useApolloClient();
  const [logout, { loading: isLogoutLoading }] = useLogoutMutation();
  const router = useRouter();

  if (isLoading) {
    return null;
  }

  if (currentUser) {
    return (
      <Button
        variant="text"
        sx={{ color: isMenu ? '#000' : '#fff' }}
        disabled={isLogoutLoading}
        onClick={async () => {
          await logout();
          await apolloClient.resetStore();
          router.push('/');
        }}
      >
        Log out
      </Button>
    );
  }

  return (
    <NextLink href="/login" style={{ textDecoration: 'none' }} onClick={onClick}>
      <Typography variant="button" sx={{ color: isMenu ? '#000' : '#fff' }}>
        Log in
      </Typography>
    </NextLink>
  );
}
