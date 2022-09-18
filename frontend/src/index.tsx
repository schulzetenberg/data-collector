import React from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { BrowserRouter as Router } from 'react-router-dom';
import { SessionProvider } from '@schulzetenberg/component-library';

import theme from './theme';
import './index.scss';
import App from './app';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <SessionProvider>
    <Router basename={process.env.PUBLIC_URL}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </StyledEngineProvider>
    </Router>
  </SessionProvider>
);
