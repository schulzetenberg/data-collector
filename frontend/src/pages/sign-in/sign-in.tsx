import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import Container from '@mui/material/Container';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import {
  ErrorList,
  Form,
  Button,
  Checkbox2,
  TextField2,
  useValidation,
  SessionContext,
  Request,
} from '@schulzetenberg/component-library';
import { CatchResponse, ServerResponse } from '../../types/response';

const useStyles = makeStyles((theme: Theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
}));

const SignIn: React.FC = ({ location }: any) => {
  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirect') || '/';

  const classes = useStyles();
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState<string[]>([]);

  const { setSession } = React.useContext(SessionContext);

  type FormData = {
    email: string;
    password: string;
  };

  const validationSchema = yup.object().shape({
    email: yup.string().required('Required').email('Invalid email'),
    password: yup.string().required('Required'),
  });

  const resolver = useValidation(validationSchema);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver });

  const formProps = { control, errors, disabled: isLoading, fullWidth: true };

  const submit = async (body: FormData): Promise<void> => {
    setLoginErrors([]);
    setLoading(true);

    try {
      const { data: response }: ServerResponse = await Request.post({ url: '/signin', body });
      setSession({ email: response.data.email });
      history.push(redirectPath);
    } catch (e) {
      setLoading(false);
      setLoginErrors(e as CatchResponse);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box mt={5}>
        <Link variant="button" component={RouterLink} to="/" color="textPrimary" underline="hover">
          <Typography variant="h4" align="center" gutterBottom>
            Data Collector
          </Typography>
        </Link>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <ErrorList errors={loginErrors} />
          <Form disabled={formProps.disabled} onSubmit={handleSubmit(submit)}>
            <TextField2
              {...formProps}
              name="email"
              label="Email Address"
              required
              type="email"
              autoComplete="email"
              autoFocus
            />

            <TextField2
              {...formProps}
              name="password"
              label="Password"
              required
              type="password"
              autoComplete="current-password"
            />

            <Checkbox2 {...formProps} name="remember" color="primary" label="Remember me" />

            <Button {...formProps} name="sign-in" type="submit">
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link component={RouterLink} to="/forgot-password" variant="body2" underline="hover">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to="/sign-up" variant="body2" underline="hover">
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Form>
        </div>
      </Box>
    </Container>
  );
};

export default SignIn;
