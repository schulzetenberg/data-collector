import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './pages/home/home';
import SignIn from './pages/sign-in/sign-in';
import NotFound from './pages/not-found/not-found';
import ForgotPassword from './pages/forgot-password/forgot-password';
import SignUp from './pages/sign-up/sign-up';

const Routes: React.FC = () => {
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
			<Route>
				<NotFound />
			</Route>
    </Switch>
  );
};

export default Routes;
