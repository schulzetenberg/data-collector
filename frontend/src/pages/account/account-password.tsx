import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardHeader, CardContent, CardActions, Divider, Grid, Button, TextField } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(5),
  },
}));

const AccountPassword: React.FC<{ saveData: Function; isLoading: boolean }> = ({ saveData, isLoading }) => {
  const classes = useStyles();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const submit = (): void => {
    saveData({ password, confirmPassword });
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
                type="password"
                disabled={isLoading}
                onChange={(e: any): void => setPassword(e.target.value)}
                required
                value={password}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                margin="dense"
                name="confirmPassword"
                type="password"
                disabled={isLoading}
                onChange={(e: any): void => setConfirmPassword(e.target.value)}
                required
                value={confirmPassword}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={submit} disabled={isLoading}>
            Update Password
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

export default AccountPassword;
