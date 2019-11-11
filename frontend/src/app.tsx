import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import Header from './components/header/header';
import Routes from './routes';
import { UserProvider } from './util/user-context';
import { SessionContext } from './util/session-context';

axios.defaults.headers.post['Content-Type'] = 'application/json';

const noHeaderPages = ['/sign-in', '/forgot-password', '/sign-up'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const App: React.FC = ({ location }: any) => {
  const { setSession }: any = React.useContext(SessionContext);

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const { status } = error.response;

      if (status === 401) {
        setSession();
      }
      return Promise.reject(error);
    }
  );

  return (
    <UserProvider>
      {noHeaderPages.indexOf(location.pathname) < 0 && <Header />}
      <Routes />
    </UserProvider>
  );
};

export default withRouter(App);
