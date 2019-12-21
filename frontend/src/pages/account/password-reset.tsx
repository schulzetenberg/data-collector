import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

import Request from '../../util/request';
import AccountPassword from './account-password';
import { SessionContext } from '../../util/session-context';
import ErrorList from '../../components/error-list/error-list';

const useStyles = makeStyles((theme: Theme) => ({}));

const PasswordReset: React.FC = (props: any) => {
  const classes = useStyles();
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState<string[]>([]);

  const { setSession }: any = React.useContext(SessionContext);
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

      setSession({ email: response.data.email });
      history.push('/account');
    } catch (e) {
      setLoading(false);
      setLoginErrors(e);
    }
  };

  return (
    <div>
      <ErrorList errors={loginErrors} />
      <AccountPassword saveData={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default PasswordReset;
