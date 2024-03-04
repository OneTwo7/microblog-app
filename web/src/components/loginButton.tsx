import NextLink from 'next/link';
import { Typography } from '@mui/material';
import { User } from '@/gql/graphql';

type LoginButtonProps = {
  isMenu: boolean;
  isLoading: boolean;
  currentUser?: Partial<User> | null;
  onClick: () => void;
};

export default function LoginButton({ isMenu, isLoading, currentUser, onClick }: LoginButtonProps) {
  if (isLoading || currentUser) {
    return null;
  }

  return (
    <NextLink href="/login" style={{ textDecoration: 'none' }} onClick={onClick}>
      <Typography variant="button" sx={{ color: isMenu ? '#000' : '#fff' }}>
        Log in
      </Typography>
    </NextLink>
  );
}
