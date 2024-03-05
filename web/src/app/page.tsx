import { CurrentUserDocument } from '@/gql/graphql';
import { getClient } from '@/utils/apolloClient';
import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';

export default async function Home() {
  const apolloClient = getClient();
  const { data, loading } = await apolloClient.query({
    query: CurrentUserDocument,
  });

  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection="column"
      p={4}
      pb={8}
      sx={{
        position: 'relative',
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
      {!loading && !data?.currentUser && (
        <Link href="/register" style={{ position: 'absolute', bottom: '2rem' }}>
          <Button variant="contained">Sign up now</Button>
        </Link>
      )}
    </Box>
  );
}
