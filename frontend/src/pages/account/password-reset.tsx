import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

import { Typography } from '@material-ui/core';
import Request from '../../util/request';
import AccountPassword from './account-password';
import UserContext from '../../util/user-context';
import { SessionContext } from '../../util/session-context';

const useStyles = makeStyles((theme: Theme) => ({
  errorMessage: {
    color: theme.palette.error.main,
    marginTop: theme.spacing(2),
  },
}));

const PasswordReset: React.FC = (props: any) => {
  const classes = useStyles();
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState<string[]>([]);

  const { dispatch }: any = React.useContext(UserContext);
  const { setSession }: any = React.useContext(SessionContext);
  const setUserState = (firstName: string, lastName: string, email: string): void =>
    dispatch({ type: 'set-user', payload: { firstName, lastName, email } });

  const {
    match: {
      params: { token },
    },
  } = props;

  const handleSubmit = async (passwords: { password: string; confirmPassword: string }) => {
    setLoginErrors([]);
    setLoading(true);

    try {
      const response: ServerResponse = await Request.post({
        url: '/reset',
        body: { ...passwords, token },
      });

      setLoading(false);

      if (!response.errors) {
        setSession({ email: response.data.email });
        setUserState(response.data.firstName, response.data.lastName, response.data.email);
        history.push('/account');
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
    <div>
      {loginErrors.map((error, index) => (
        <Typography className={classes.errorMessage} key={index} variant="body1" align="center">
          {error}
        </Typography>
      ))}
      <AccountPassword saveData={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default PasswordReset;
