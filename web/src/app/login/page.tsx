'use client';
import { Box, Button, TextField, Typography } from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from '@/hooks';
import { CurrentUserDocument, CurrentUserQuery, useLoginMutation } from '@/gql/graphql';
import { LoadingButton } from '@mui/lab';
import { KeyboardEvent } from 'react';

type FormErrors = {
  usernameOrEmail?: string;
  password?: string;
};

export default function Login() {
  const router = useRouter();
  const { formData, formErrors, onChange, mapErrors } = useForm<FormErrors>();
  const [login, { loading }] = useLoginMutation();

  const handleSubmit = async () => {
    const response = await login({
      variables: {
        options: {
          usernameOrEmail: formData.usernameOrEmail || '',
          password: formData.password || '',
        },
      },
      update: (cache, { data }) => {
        cache.writeQuery<CurrentUserQuery>({
          query: CurrentUserDocument,
          data: {
            __typename: 'Query',
            currentUser: data?.login.user,
          },
        });
      },
    });

    mapErrors(undefined);

    if (response.data?.login.errors) {
      mapErrors(response.data.login.errors);
    } else if (response.data?.login.user) {
      router.push('/profile');
    }
  };

  const onFormKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Box display="flex" alignItems="center" flexDirection="column" py={2} mx="auto" textAlign="center" maxWidth="600px">
      <Typography variant="h1" mb={4} sx={{ fontSize: '3.5rem' }}>
        Log in
      </Typography>
      <form onKeyDown={onFormKeyDown}>
        <TextField
          type="text"
          name="usernameOrEmail"
          variant="outlined"
          color="primary"
          label="Username or Email"
          onChange={onChange}
          value={formData['usernameOrEmail'] || ''}
          helperText={formErrors && formErrors['usernameOrEmail']}
          error={formErrors && !!formErrors['usernameOrEmail']}
          autoFocus
          fullWidth
          required
          sx={{ mb: 4 }}
        />
        <TextField
          type="password"
          name="password"
          variant="outlined"
          color="primary"
          label="Password"
          onChange={onChange}
          value={formData['password'] || ''}
          helperText={formErrors && formErrors['password']}
          error={formErrors && !!formErrors['password']}
          required
          fullWidth
          sx={{ mb: 4 }}
        />
        <LoadingButton variant="outlined" color="primary" type="button" loading={loading} onClick={handleSubmit}>
          Log in
        </LoadingButton>
      </form>
      <Typography variant="body2" mt={2}>
        New user?{' '}
        <NextLink href="/resister" style={{ textDecoration: 'none' }}>
          <Button variant="text" sx={{ textDecoration: 'none', textTransform: 'none' }}>
            Sign up
          </Button>
        </NextLink>
      </Typography>
    </Box>
  );
}
