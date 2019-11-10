import React from 'react';
import { withRouter } from 'react-router-dom';

import Header from './components/header/header';
import Routes from './routes';
import { UserProvider } from './components/user-context/user-context';

const noHeaderPages = ['/sign-in', '/forgot-password', '/sign-up'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const App: any = ({ location }: any) => {
  return (
    <UserProvider>
      {noHeaderPages.indexOf(location.pathname) < 0 && <Header />}
      <Routes />
    </UserProvider>
  );
};

export default withRouter(App);
