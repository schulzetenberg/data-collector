import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { Box, Snackbar, SnackbarContent } from '@material-ui/core';

import { SessionContext } from '../../util/session-context';
import Request from '../../util/request';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    flexWrap: 'wrap',
  },
  fillSpace: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  snackbar: {
    marginTop: theme.spacing(8),
  },
  snackbarContent: {
    color: theme.palette.error.main,
  },
}));

const Header: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { session, setSession }: any = React.useContext(SessionContext);
  const [isLoading, setLoading] = useState(false);
  const [logoutErrors, setLogoutErrors] = useState<string[]>([]);
  const isLoggedIn = !!session && session.email;

  const handleLogout = async () => {
    setLogoutErrors([]);
    setLoading(true);

    try {
      const response: ServerResponse = await Request.post({ url: '/logout' });
      setLoading(false);

      if (!response.errors) {
        setSession();
        history.push('/sign-in');
      } else {
        setLogoutErrors(response.errors);
      }
    } catch (e) {
      console.log(e);
      setLogoutErrors(['Error lgging out']);
      setLoading(false);
    }
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Snackbar
        autoHideDuration={5000}
        className={classes.snackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={logoutErrors.length > 0}
        onClose={(): void => {
          setLogoutErrors([]);
        }}
      >
        <SnackbarContent
          className={classes.snackbarContent}
          message={
            <>
              {logoutErrors.map((error, index) => (
                <span key={index}>
                  {error} <br />
                </span>
              ))}
            </>
          }
        />
      </Snackbar>

      <Toolbar className={classes.toolbar}>
        <Link variant="button" component={RouterLink} to="/" color="textPrimary">
          <Typography variant="h6" color="inherit">
            Data Collector
          </Typography>
        </Link>
        <Box className={classes.fillSpace} />

        {isLoggedIn && (
          <nav>
            <Link variant="button" component={RouterLink} to="/app-config" color="textPrimary" className={classes.link}>
              Settings
            </Link>
            <Link variant="button" component={RouterLink} to="/account" color="textPrimary" className={classes.link}>
              Account
            </Link>
          </nav>
        )}

        {isLoggedIn && (
          <Button
            onClick={handleLogout}
            disabled={isLoading}
            color="primary"
            variant="outlined"
            className={classes.link}
          >
            Logout
          </Button>
        )}

        {!isLoggedIn && (
          <Button component={RouterLink} to="/sign-in" color="primary" variant="outlined" className={classes.link}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
