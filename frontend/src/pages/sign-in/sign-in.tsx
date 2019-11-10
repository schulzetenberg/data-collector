import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link as RouterLink, useHistory } from 'react-router-dom';

import Form from '../../components/form/form';
import Request from '../../components/request/request';
import UserContext from '../../util/user-context';
import { SessionContext } from '../../util/session-context';

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
  const { dispatch }: any = React.useContext(UserContext);
  const [isLoading, setLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState<string[]>([]);
  const { setSession }: any = React.useContext(SessionContext);
  const setUserState = (name: string, email: string): void => dispatch({ type: 'set-user', payload: { name, email } });

  const submit = async (inputs: { email: string; password: string }) => {
    setLoginErrors([]);
    setLoading(true);

    try {
      const response: ServerResponse = await Request.post({ url: 'signin', body: inputs });
      setLoading(false);

      if (!response.error) {
        setSession({ email: response.data.email });
        setUserState(response.data.name, response.data.email);
        history.push('/');
      } else if (Array.isArray(response.error)) {
        const errorList = response.error.map((x) => x.msg);
        setLoginErrors(errorList);
      } else {
        setLoginErrors([response.error]);
      }
    } catch (e) {
      console.log(e);
      setLoginErrors(['Error signing in']);
      setLoading(false);
    }
  };

  const {
    inputs,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
  }: {
    inputs: { email: string; password: string; remember: boolean };
    handleInputChange: any;
    handleCheckboxChange: any;
    handleSubmit: any;
  } = Form({ email: '', password: '', remember: false }, submit);

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
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              type="email"
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={inputs.email}
              disabled={isLoading}
              onChange={handleInputChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={inputs.password}
              disabled={isLoading}
              onChange={handleInputChange}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="remember"
                  color="primary"
                  value={inputs.remember}
                  disabled={isLoading}
                  onChange={handleCheckboxChange}
                />
              }
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
