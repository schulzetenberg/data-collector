import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ErrorList, SessionContext, Request } from '@schulzetenberg/component-library';

import AccountPassword from './account-password';
import { CatchResponse, ServerResponse } from '../../types/response';

const PasswordReset: React.FC = (props: any) => {
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState<string[]>([]);

  const { setSession } = React.useContext(SessionContext);
  const {
    match: {
      params: { token },
    },
  } = props;

  const handleSubmit = async (passwords: { password: string; confirmPassword: string }) => {
    setLoginErrors([]);
    setLoading(true);

    try {
      const { data: response }: ServerResponse = await Request.post({
        url: '/reset',
        body: { ...passwords, token },
      });

      setSession({ email: response.data.email });
      history.push('/account');
    } catch (e) {
      setLoading(false);
      setLoginErrors(e as CatchResponse);
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
