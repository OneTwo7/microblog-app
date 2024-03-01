'use client';
import { Box, Button, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import NextLink from 'next/link';
import { KeyboardEvent } from 'react';
import { CurrentUserDocument, CurrentUserQuery, useRegisterMutation } from '@/gql/graphql';
import { useRouter } from 'next/navigation';
import { LoadingButton } from '@mui/lab';
import withApollo from '@/utils/withApollo';
import { useForm } from '@/hooks';

type FormErrors = {
  email?: string;
  username?: string;
  password?: string;
  'password-confirmation'?: string;
};

function Register() {
  const router = useRouter();
  const { formData, formErrors, onChange, mapErrors } = useForm<FormErrors>();
  const [register, { loading }] = useRegisterMutation();

  const handleSubmit = async () => {
    if (formData.password !== formData['password-confirmation']) {
      mapErrors([
        {
          field: 'password-confirmation',
          message: 'does not match Password',
        },
      ]);
      return;
    }

    const response = await register({
      variables: {
        options: {
          email: formData.email || '',
          username: formData.username || '',
          password: formData.password || '',
        },
      },
      update: (cache, { data }) => {
        cache.writeQuery<CurrentUserQuery>({
          query: CurrentUserDocument,
          data: {
            __typename: 'Query',
            currentUser: data?.register.user,
          },
        });
      },
    });

    mapErrors(undefined);

    if (response.data?.register.errors) {
      mapErrors(response.data.register.errors);
    } else if (response.data?.register.user) {
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
        Register
      </Typography>
      <form onKeyDown={onFormKeyDown}>
        <TextField
          type="text"
          name="username"
          variant="outlined"
          color="primary"
          label="Username"
          onChange={onChange}
          value={formData['username'] || ''}
          helperText={formErrors && formErrors['username']}
          error={formErrors && !!formErrors['username']}
          fullWidth
          required
          sx={{ mb: 4 }}
        />
        <TextField
          type="email"
          name="email"
          variant="outlined"
          color="primary"
          label="Email"
          onChange={onChange}
          value={formData['email'] || ''}
          helperText={formErrors && formErrors['email']}
          error={formErrors && !!formErrors['email']}
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
        <TextField
          type="password"
          name="password-confirmation"
          variant="outlined"
          color="primary"
          label="Password Confirmation"
          onChange={onChange}
          value={formData['password-confirmation'] || ''}
          helperText={formErrors && formErrors['password-confirmation']}
          error={formErrors && !!formErrors['password-confirmation']}
          fullWidth
          required
          sx={{ mb: 4 }}
        />
        <LoadingButton
          variant="outlined"
          color="primary"
          type="button"
          endIcon={<SendIcon />}
          loadingPosition="end"
          loading={loading}
          onClick={handleSubmit}
        >
          Register
        </LoadingButton>
      </form>
      <Typography variant="body2" mt={2}>
        Already have an account?{' '}
        <NextLink href="/login" style={{ textDecoration: 'none' }}>
          <Button variant="text" sx={{ textDecoration: 'none', textTransform: 'none' }}>
            Log in
          </Button>
        </NextLink>
      </Typography>
    </Box>
  );
}

export default withApollo({ ssr: false })(Register);
