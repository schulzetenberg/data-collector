import React, { ReactElement } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { SessionContext } from '@schulzetenberg/component-library';

// import Home from './pages/home/home';
import SignIn from './pages/sign-in/sign-in';
import NotFound from './pages/not-found/not-found';
import ForgotPassword from './pages/forgot-password/forgot-password';
import SignUp from './pages/sign-up/sign-up';
import AppConfig from './pages/app-config/app-config';
import Account from './pages/account/account';
import PasswordReset from './pages/account/password-reset';
import AppSettings from './pages/app-settings/app-settings';

const AuthenticatedRoute = ({ component: Component, session, ...rest }: any): ReactElement => {
  return (
    <Route
      {...rest}
      render={(props: any): ReactElement =>
        session ? <Component {...props} /> : <Redirect to={`/sign-in?redirect=${props.location.pathname}`} />
      }
    />
  );
};

const PublicRoute = ({ component: Component, ...rest }: any): ReactElement => {
  return <Route {...rest} render={(props: any): any => <Component {...props} />} />;
};

const Routes: React.FC = () => {
  const { session }: any = React.useContext(SessionContext);

  return (
    <Switch>
      <AuthenticatedRoute session={session} component={AppConfig} path="/" exact />
      {/* <PublicRoute component={Home} path="/" exact /> */}

      <PublicRoute component={SignIn} path="/sign-in" />
      <PublicRoute component={SignUp} path="/sign-up" />
      <PublicRoute component={ForgotPassword} path="/forgot-password" />
      <PublicRoute component={PasswordReset} path="/reset-password/:token" />

      <AuthenticatedRoute session={session} component={Account} path="/account" />
      <AuthenticatedRoute session={session} component={AppConfig} path="/app-config" />
      <AuthenticatedRoute session={session} component={AppSettings} path="/app-settings/:appName" />

      <PublicRoute component={NotFound} />
    </Switch>
  );
};

export default Routes;
