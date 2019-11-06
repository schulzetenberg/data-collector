import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './pages/home/home';
import SignIn from './pages/sign-in/sign-in';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/sign-in">
        <SignIn />
      </Route>
    </Switch>
  );
};

export default Routes;
