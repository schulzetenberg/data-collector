import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Button from '../../components/button/button';
import Checkbox from '../../components/checkbox/checkbox';
import Form from '../../components/form/form';
import TextField from '../../components/text-field/text-field';
import Request from '../../util/request';
import { SessionContext } from '../../util/session-context';
import ErrorList from '../../components/error-list/error-list';

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

  const { setSession }: any = React.useContext(SessionContext);

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .required('Required')
      .email('Invalid email'),
    password: yup.string().required('Required'),
  });

  type FormData = {
    email: string;
    password: string;
  };

  const { handleSubmit, register, setValue, errors } = useForm<FormData>({
    validationSchema,
  });

  const formProps = { disabled: isLoading, errors, register, setValue, fullWidth: true };

  const submit = async (body: FormData): Promise<void> => {
    setLoginErrors([]);
    setLoading(true);

    try {
      const response: ServerResponse = await Request.post({ url: '/signin', body });
      setSession({ email: response.data.email });
      history.push(redirectPath);
    } catch (e) {
      setLoading(false);
      setLoginErrors(e);
    }
  };

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
            Sign In
          </Typography>
          <ErrorList errors={loginErrors} />
          <Form disabled={formProps.disabled} onSubmit={handleSubmit(submit)}>
            <TextField
              {...formProps}
              name="email"
              label="Email Address"
              required
              type="email"
              autoComplete="email"
              autoFocus
            />

            <TextField
              {...formProps}
              name="password"
              label="Password"
              required
              type="password"
              autoComplete="current-password"
            />

            <Checkbox {...formProps} name="remember" errors={errors} color="primary" label="Remember me" />

            <Button {...formProps} name="sign-in" type="submit">
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link component={RouterLink} to="/forgot-password" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to="/sign-up" variant="body2">
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
