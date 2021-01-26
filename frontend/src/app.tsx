import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import { Header, SessionContext, ErrorBoundary } from '@schulzetenberg/component-library';

import Routes from './routes';

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
      return Promise.reject(error.response);
    }
  );

  return (
    <ErrorBoundary>
      {noHeaderPages.indexOf(location.pathname) < 0 && <Header />}
      <Routes />
    </ErrorBoundary>
  );
};

export default withRouter(App);
