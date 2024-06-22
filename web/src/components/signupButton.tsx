'use client';
import { useCurrentUserQuery } from '@/gql/graphql';
import { Button } from '@mui/material';
import Link from 'next/link';

export default function SignupButton() {
  const { data, loading } = useCurrentUserQuery();

  if (loading || data?.currentUser) {
    return null;
  }

  return (
    <Link href="/register" style={{ position: 'absolute', bottom: '2rem' }}>
      <Button variant="contained">Sign up now</Button>
    </Link>
  );
}
