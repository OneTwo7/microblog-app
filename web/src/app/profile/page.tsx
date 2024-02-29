import { Typography } from '@mui/material';

type ProfileProps = {
  currentUser?: {
    username: string;
    email: string;
  };
};

export default function Profile({ currentUser }: ProfileProps) {
  if (!currentUser) {
    return null;
  }

  return (
    <Typography>
      {currentUser.username}, {currentUser.email}
    </Typography>
  );
}
