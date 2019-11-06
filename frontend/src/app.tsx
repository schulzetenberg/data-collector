import React from 'react';
import { withRouter } from 'react-router-dom';

import Header from './components/header/header';
import Routes from './routes';

const noHeaderPages = ['/sign-in'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const App: any = ({ location }: any) => {
  return (
    <>
      {noHeaderPages.indexOf(location.pathname) < 0 && <Header />}
      <Routes />
    </>
  );
};

export default withRouter(App);
