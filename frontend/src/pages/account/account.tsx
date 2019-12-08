import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

import AccountProfile from './account-profile';
import AccountDetails from './account-details';
import AccountPassword from './account-password';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
}));

const Account = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item lg={8} md={6} xl={8} xs={12}>
          <AccountDetails />
          <AccountPassword />
        </Grid>
        <Grid item lg={4} md={6} xl={4} xs={12}>
          <AccountProfile />
        </Grid>
      </Grid>
    </div>
  );
};

export default Account;
