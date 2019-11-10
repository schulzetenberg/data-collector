import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';
import { Box } from '@material-ui/core';

import UserContext from '../user-context/user-context';

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
}));

const Header: React.FC = () => {
  const classes = useStyles();
  const { state }: any = React.useContext(UserContext);
  const isLoggedIn = !!state.name;

  return (
    <AppBar position="static" color="default" elevation={1}>
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
          <Button component={RouterLink} to="/sign-out" color="primary" variant="outlined" className={classes.link}>
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
