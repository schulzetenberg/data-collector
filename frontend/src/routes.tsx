import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Home from './pages/home/home';
import SignIn from './pages/sign-in/sign-in';
import NotFound from './pages/not-found/not-found';
import ForgotPassword from './pages/forgot-password/forgot-password';
import SignUp from './pages/sign-up/sign-up';
import AppConfig from './pages/app-config/app-config';
import { SessionContext } from './util/session-context';
import Account from './pages/account/account';

const AuthenticatedRoute = ({ component: Component, session, ...rest }: any): any => {
  return (
    <Route
      {...rest}
      render={(props: any) =>
        session ? <Component {...props} /> : <Redirect to={`/sign-in?redirect=${props.location.pathname}`} />
      }
    />
  );
};

const PublicRoute = ({ component: Component, ...rest }: any): any => {
  return <Route {...rest} render={ (props: any) =>  <Component {...props} /> } />
};

const Routes: React.FC = () => {
  const { session }: any = React.useContext(SessionContext);

  return (
    <Switch>
			<PublicRoute component={Home} path="/" exact />
			<PublicRoute component={SignIn} path="/sign-in" />
			<PublicRoute component={SignUp} path="/sign-up" />
			<PublicRoute component={ForgotPassword} path="/forgot-password" />

			<AuthenticatedRoute component={Account} session={session} path="/account" />
      <AuthenticatedRoute component={AppConfig} session={session} path="/app-config" />

			<PublicRoute component={NotFound} />
    </Switch>
  );
};

export default Routes;
