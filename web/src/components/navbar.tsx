'use client';
import { MouseEvent, useState } from 'react';
import { AppBar, Box, Button, IconButton, Link, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogoClick = (event: MouseEvent) => {
    if (pathname === '/') {
      window.location.reload();
      return;
    }

    event.preventDefault();
    router.push('/');
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          sx={{
            mr: 2,
            fontFamily: 'monospace',
            fontWeight: 700,
            color: 'inherit',
            textDecoration: 'none',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
          onClick={handleLogoClick}
        >
          Sample App
        </Typography>

        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none', justifyContent: 'flex-end' } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            <MenuItem onClick={handleCloseNavMenu}>
              <Link variant="button" color="inherit" sx={{ textDecoration: 'none' }}>
                Log in
              </Link>
            </MenuItem>
          </Menu>
        </Box>

        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', justifyContent: 'flex-end' } }}>
          <NextLink href="/login" style={{ textDecoration: 'none' }} onClick={handleCloseNavMenu}>
            <Button sx={{ color: 'white' }}>Log in</Button>
          </NextLink>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
