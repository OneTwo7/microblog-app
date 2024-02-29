'use client';
import { CircularProgress, Typography } from '@mui/material';
import { useCurrentUserQuery } from '@/gql/graphql';
import withApollo from '@/utils/withApollo';

function Profile() {
  const { data, loading } = useCurrentUserQuery();

  if (loading) {
    return <CircularProgress />;
  }

  if (!data?.currentUser) {
    return null;
  }

  return (
    <Typography>
      {data.currentUser.username}, {data.currentUser.email}
    </Typography>
  );
}

export default withApollo({ ssr: false })(Profile);
