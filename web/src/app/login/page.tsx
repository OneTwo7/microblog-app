import { Typography } from '@mui/material';
import withApollo from '@/utils/withApollo';

function Login() {
  return <Typography>Login</Typography>;
}

export default withApollo({ ssr: true })(Login);
