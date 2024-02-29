import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection="column"
      p={4}
      sx={{
        borderBottomRightRadius: '7.5px',
        borderBottomLeftRadius: '7.5px',
        backgroundColor: '#ddd',
        textAlign: 'center',
      }}
    >
      <Typography variant="h1" mb={2} sx={{ fontSize: '4rem' }}>
        Welcome to the Sample App
      </Typography>
      <Typography variant="body1" mb={4}>
        This is the home page for the Next.js Sample Application based on Ruby on Rails Tutorial
      </Typography>
      <Link href="/register" style={{ marginBottom: '2rem' }}>
        <Button variant="contained">Sign up now</Button>
      </Link>
    </Box>
  );
}