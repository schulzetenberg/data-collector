import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link as RouterLink } from 'react-router-dom';

import Request from '../../util/request';
import Form from '../../components/form/form';

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
  message: {
    marginTop: theme.spacing(8),
  },
  errorMessage: {
    color: theme.palette.error.main,
    marginTop: theme.spacing(2),
  },
}));

const ForgotPassword: React.FC = () => {
  const classes = useStyles();
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState<string[]>([]);

  const submit = async (inputs: { email: string }) => {
    setLoginErrors([]);
    setResetSuccess(false);
    setLoading(true);

    try {
      const response: ServerResponse = await Request.post({ url: '/forgot', body: inputs });
      setLoading(false);

      if (!response.error) {
        setResetSuccess(true);
      } else if (Array.isArray(response.error)) {
        const errorList = response.error.map((x) => x.msg);
        setLoginErrors(errorList);
      } else {
        setLoginErrors([response.error]);
      }
    } catch (e) {
      console.log(e);
      setLoginErrors(['Error creating sending reset instructions']);
      setLoading(false);
    }
  };

  const { inputs, handleInputChange, handleSubmit } = Form({ email: '' }, submit);

  return (
    <Container component="main" maxWidth="sm">
      <Box mt={5}>
        <Link variant="button" component={RouterLink} to="/" color="textPrimary">
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Data Collector
          </Typography>
        </Link>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Password Reset
          </Typography>
          {(resetSuccess && (
            <p className={classes.message}>{`An e-mail has been sent to ${inputs.email} with reset instructions`}</p>
          )) || (
            <>
              {loginErrors.map((error, index) => (
                <Typography className={classes.errorMessage} key={index} variant="body1" align="center">
                  {error}
                </Typography>
              ))}
              <p>Enter your email address to receive password reset instructions</p>
              <Grid item xs={12} sm={10}>
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
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    className={classes.submit}
                  >
                    Reset Password
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link component={RouterLink} to="/sign-in" variant="body2">
                        Sign In
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link component={RouterLink} to="/sign-in" variant="body2">
                        Don't have an account? Sign Up
                      </Link>
                    </Grid>
                  </Grid>
                </form>
              </Grid>
            </>
          )}
        </div>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
