import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardHeader, CardContent, CardActions, Divider, Grid, Button, TextField } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(5),
  },
}));

const AccountPassword = () => {
  const classes = useStyles();

  const handleChange = (event: any) => {
    console.log('TODO', event.target);
  };

  const values = {
    password: 'Test',
    confirmPassword: 'Test',
  };

  return (
    <Card className={classes.card}>
      <form autoComplete="off" noValidate>
        <CardHeader title="Change Password" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="New Password"
                margin="dense"
                name="password"
                onChange={handleChange}
                required
                value={values.password}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                margin="dense"
                name="confirmPassword"
                onChange={handleChange}
                required
                value={values.confirmPassword}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button color="primary" variant="contained">
            Save Changes
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

export default AccountPassword;
