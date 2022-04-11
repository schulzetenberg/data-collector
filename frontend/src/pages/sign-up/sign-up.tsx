import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import {
  Button,
  Form,
  TextField2,
  ErrorList,
  Request,
  SessionContext,
  useValidation,
} from '@schulzetenberg/component-library';
import { ServerResponse } from '../../types/response';

const useStyles = makeStyles((theme) => ({
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

const SignUp: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [signupErrors, setSignupErrors] = useState<string[]>([]);
  const { setSession }: any = React.useContext(SessionContext);
  const submit = async (inputs: { email: string; password: string }): Promise<void> => {
    setSignupErrors([]);
    setLoading(true);

    try {
      const { data: response }: ServerResponse = await Request.post({ url: '/signup', body: inputs });
      setSession({ email: response.data.email });
      history.push('/');
    } catch (e: any) {
      setLoading(false);
      setSignupErrors(e);
    }
  };

  const validationSchema = yup.object().shape({
    firstName: yup.string().required('Required'),
    lastName: yup.string().required('Required'),
    email: yup.string().required('Required').email('Invalid email'),
    password: yup.string().required('Required').min(4, 'Password must be at least 4 characters long'),
    confirmPassword: yup.string().required('Required').min(4, 'Password must be at least 4 characters long'),
  });

  type FormData = { firstName: string; lastName: string; email: string; password: string; confirmPassword: string };
  const resolver = useValidation(validationSchema);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({ resolver });

  const formProps = { disabled: isLoading, control, errors, fullWidth: true };

  return (
    <Container component="main" maxWidth="xs">
      <Box mt={5}>
        <Link variant="button" component={RouterLink} to="/" color="textPrimary">
          <Typography variant="h4" align="center" gutterBottom>
            Data Collector
          </Typography>
        </Link>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <ErrorList errors={signupErrors} />
          <Form disabled={isLoading} onSubmit={handleSubmit(submit)}>
            <TextField2
              {...formProps}
              required
              label="First Name"
              name="firstName"
              autoComplete="first-name"
              autoFocus
            />
            <TextField2 {...formProps} required label="Last Name" name="lastName" autoComplete="last-name" />
            <TextField2 {...formProps} required type="email" label="Email Address" name="email" autoComplete="email" />
            <TextField2
              {...formProps}
              required
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
            />
            <TextField2
              {...formProps}
              required
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              autoComplete="current-password"
            />
            <Button {...formProps} type="submit">
              Create Account
            </Button>
            <Grid container>
              <Grid item xs>
                <Link component={RouterLink} to="/forgot-password" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to="/sign-in" variant="body2">
                  Already have an account? Sign In
                </Link>
              </Grid>
            </Grid>
          </Form>
        </div>
      </Box>
    </Container>
  );
};

export default SignUp;
