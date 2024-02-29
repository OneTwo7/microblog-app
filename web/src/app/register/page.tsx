'use client';
import { gql, useQuery } from '@apollo/client';
import { Box, Button, TextField, Typography } from '@mui/material';
import NextLink from 'next/link';
import { ChangeEvent, KeyboardEvent, useState } from 'react';
import withApollo from '../../utils/withApollo';

type CurrentUser = {
  id: number;
  email: string;
  username: string;
};

function useForm() {
  const [data, setData] = useState<{ [key: string]: string | undefined }>({});

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = event.target;

    setData((prevData) => ({
      ...prevData,
      [name]: event.target.value,
    }));
  };

  return {
    data,
    onChange,
  };
}

function Register() {
  const { data, onChange } = useForm();
  const currentUserQueryResult = useQuery<CurrentUser>(gql`
    query CurrentUser {
      currentUser {
        id
        email
        username
      }
    }
  `);

  console.log('currentUser', currentUserQueryResult);

  const handleSubmit = () => {
    console.log('data', data);
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
          value={data['username'] || ''}
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
          value={data['email'] || ''}
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
          value={data['password'] || ''}
          required
          fullWidth
          sx={{ mb: 4 }}
        />
        <TextField
          type="password"
          name="confirm-password"
          variant="outlined"
          color="primary"
          label="Confirm Password"
          onChange={onChange}
          value={data['confirm-password'] || ''}
          fullWidth
          required
          sx={{ mb: 4 }}
        />
        <Button variant="outlined" color="primary" type="button" onClick={handleSubmit}>
          Register
        </Button>
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
