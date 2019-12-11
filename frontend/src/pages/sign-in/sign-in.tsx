import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import useForm from 'react-hook-form';
import * as yup from 'yup';

import Checkbox from '../../components/checkbox/checkbox';
import TextField from '../../components/text-field/text-field';
import Request from '../../util/request';
import UserContext from '../../util/user-context';
import { SessionContext } from '../../util/session-context';

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
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  errorMessage: {
    color: theme.palette.error.main,
    marginTop: theme.spacing(2),
  },
}));

const SignIn: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState<string[]>([]);

  const { dispatch }: any = React.useContext(UserContext);
  const { setSession }: any = React.useContext(SessionContext);
  const setUserState = (name: string, email: string): void => dispatch({ type: 'set-user', payload: { name, email } });

  type FormData = {
    email: string;
    password: string;
  };

  const signInSchema = yup.object().shape({
    email: yup
      .string()
      .required('Required')
      .email('Invalid email'),
    password: yup.string().required('Required'),
  });

  const { handleSubmit, register, setValue, errors } = useForm<FormData>({
    validationSchema: signInSchema,
  });

  const submit = async (body: FormData): Promise<void> => {
    setLoginErrors([]);
    setLoading(true);

    try {
      const response: ServerResponse = await Request.post({ url: '/signin', body });

      if (!response.errors) {
        setSession({ email: response.data.email });
        setUserState(response.data.name, response.data.email);
        history.push('/');
      } else {
        setLoginErrors(response.errors);
      }
    } catch (e) {
      console.log(e);
      setLoginErrors(['Error signing in']);
    } finally {
      setLoading(false);
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
          {loginErrors.map((error, index) => (
            <Typography className={classes.errorMessage} key={index} variant="body1" align="center">
              {error}
            </Typography>
          ))}

          <form noValidate className={classes.form} onSubmit={handleSubmit(submit)}>
            <TextField
              name="email"
              label="Email Address"
              errors={errors}
              register={register}
              setValue={setValue}
              required
              fullWidth
              type="email"
              autoComplete="email"
              autoFocus
              disabled={isLoading}
            />

            <TextField
              name="password"
              label="Password"
              errors={errors}
              register={register}
              setValue={setValue}
              required
              fullWidth
              type="password"
              autoComplete="current-password"
              disabled={isLoading}
            />

            <Checkbox
              name="remember"
              errors={errors}
              register={register}
              setValue={setValue}
              color="primary"
              disabled={isLoading}
              label="Remember me"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              className={classes.submit}
            >
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
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Box>
    </Container>
  );
};

export default SignIn;
