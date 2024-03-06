'use client';
import NextLink from 'next/link';
import { Button, Menu, MenuItem, Typography } from '@mui/material';
import { useCurrentUserQuery, useLogoutMutation } from '@/gql/graphql';
import { useApolloClient } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { ArrowDropDown } from '@mui/icons-material';
import { useState } from 'react';

type LoginButtonProps = {
  isMenu: boolean;
  onClick: () => void;
};

export default function LoginButton({ isMenu, onClick }: LoginButtonProps) {
  const apolloClient = useApolloClient();
  const { data, loading: isCurrentUserLoading } = useCurrentUserQuery();
  const [logout, { loading: isLogoutLoading }] = useLogoutMutation();
  const router = useRouter();
  const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorMenu(null);
  };

  if (isCurrentUserLoading) {
    return null;
  }

  if (data?.currentUser) {
    if (isMenu) {
      return (
        <Button
          variant="text"
          sx={{ color: '#000' }}
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
      <>
        <Button variant="text" sx={{ color: '#fff' }} endIcon={<ArrowDropDown />} onClick={handleOpenMenu}>
          {data.currentUser.username}
        </Button>
        <Menu
          id="menu-appbar"
          anchorEl={anchorMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={Boolean(anchorMenu)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={handleCloseMenu}>
            <Button
              variant="text"
              sx={{ color: '#000', '&:hover': { backgroundColor: 'transparent' } }}
              disabled={isLogoutLoading}
              onClick={async () => {
                await logout();
                await apolloClient.resetStore();
                router.push('/');
              }}
            >
              Log out
            </Button>
          </MenuItem>
        </Menu>
      </>
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
