import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router } from 'react-router-dom';

import { SessionProvider } from '@schulzetenberg/component-library';
import theme from './theme';
import './index.scss';
import App from './app';

ReactDOM.render(
  <SessionProvider>
    <Router basename={process.env.PUBLIC_URL}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Router>
  </SessionProvider>,
  document.getElementById('root')
);
