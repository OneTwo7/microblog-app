'use client';
import { useCurrentUserQuery } from '@/gql/graphql';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function Profile() {
  const { data, loading } = useCurrentUserQuery();

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
