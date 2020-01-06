import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Button from '../../components/button/button';
import Form from '../../components/form/form';
import TextField from '../../components/text-field/text-field';
import Request from '../../util/request';
import ErrorList from '../../components/error-list/error-list';

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
  message: {
    marginTop: theme.spacing(8),
  },
}));

const ForgotPassword: React.FC = () => {
  const classes = useStyles();
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState<string[]>([]);

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .required('Required')
      .email('Invalid email'),
  });

  type FormData = {
    email: string;
  };

  const { handleSubmit, register, setValue, errors } = useForm<FormData>({
    validationSchema,
  });

  const formProps = { disabled: isLoading, errors, register, setValue, fullWidth: true };

  const submit = async (inputs: { email: string }): Promise<void> => {
    setLoginErrors([]);
    setResetSuccess(false);
    setLoading(true);

    try {
      const response: ServerResponse = await Request.post({ url: '/forgot', body: inputs });
      setResetSuccess(true);
      setLoginErrors(response.errors);
    } catch (e) {
      setLoginErrors(e);
    } finally {
      setLoading(false);
    }
  };

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
          {(resetSuccess && <p className={classes.message}>An e-mail has been sent with reset instructions</p>) || (
            <>
              <ErrorList errors={loginErrors} />
              <p>Enter your email address to receive password reset instructions</p>
              <Grid item xs={12} sm={10}>
                <Form disabled={isLoading} onSubmit={handleSubmit(submit)}>
                  <TextField
                    {...formProps}
                    name="email"
                    label="Email Address"
                    required
                    type="email"
                    autoComplete="email"
                    autoFocus
                  />
                  <Button {...formProps} type="submit">
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
                </Form>
              </Grid>
            </>
          )}
        </div>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
