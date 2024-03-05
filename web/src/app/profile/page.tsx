import { Box, CircularProgress, Typography } from '@mui/material';
import { CurrentUserDocument } from '@/gql/graphql';
import { getClient } from '@/utils/apolloClient';

export default async function Profile() {
  const apolloClient = getClient();
  const { data, loading } = await apolloClient.query({
    query: CurrentUserDocument,
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data?.currentUser) {
    return null;
  }

  return (
    <Box p={4}>
      <Typography>
        {data.currentUser.username}, {data.currentUser.email}
      </Typography>
    </Box>
  );
}
