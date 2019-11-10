import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import { Box, Snackbar, SnackbarContent } from '@material-ui/core';

import UserContext from '../user-context/user-context';
import Request from '../../components/request/request';

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
  const { state }: any = React.useContext(UserContext);
  const [isLoading, setLoading] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const [logoutErrors, setLogoutErrors] = useState<string[]>([]);
  const isLoggedIn = !!state.name;

  const handleLogout = (): void => {
    setLogoutErrors([]);
    setLoading(true);

    Request.post({ url: 'logout' })
      .then((response: ServerResponse) => {
        if (!response.error) {
          setLogoutSuccess(true);
        } else {
          setLogoutErrors([response.error]);
        }
      })
      .catch((err) => {
        console.log(err);
        setLogoutErrors(['Error lgging out']);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    (logoutSuccess && <Redirect to="/sign-in" />) || (
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

          <nav>
            <Link variant="button" component={RouterLink} to="/" color="textPrimary" className={classes.link}>
              Features
            </Link>
            <Link variant="button" component={RouterLink} to="/" color="textPrimary" className={classes.link}>
              Help
            </Link>
          </nav>
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
    )
  );
};

export default Header;
