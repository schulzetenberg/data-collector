import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Home from './pages/home/home';
import SignIn from './pages/sign-in/sign-in';
import NotFound from './pages/not-found/not-found';
import ForgotPassword from './pages/forgot-password/forgot-password';
import SignUp from './pages/sign-up/sign-up';
import AppConfig from './pages/app-config/app-config';
import { SessionContext } from './util/session-context';

const AuthenticatedRoute = ({ component: C, session, ...rest }: any): any => {
  return (
    <Route
      {...rest}
      render={(props: any): any =>
        session ? <C {...props} /> : <Redirect to={`/sign-in?redirect=${props.location.pathname}`} />
      }
    />
  );
};

const Routes: React.FC = () => {
  const { session }: any = React.useContext(SessionContext);

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/sign-in">
        <SignIn />
      </Route>
      <Route path="/sign-up">
        <SignUp />
      </Route>
      <Route path="/forgot-password">
        <ForgotPassword />
      </Route>
      <AuthenticatedRoute component={AppConfig} session={session} path="/app-config" />
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
};

export default Routes;
