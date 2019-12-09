import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardHeader, CardContent, CardActions, Divider, Grid, Button, TextField } from '@material-ui/core';

import Request from '../../util/request';

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(5),
  },
}));

const AccountPassword: React.FC = () => {
  const classes = useStyles();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async () => {
    try {
      const response: ServerResponse = await Request.post({
        url: 'account/password',
        body: { password, confirmPassword },
      });

      // TODO: add toast messages & error handling
      alert('Updated');
    } catch (e) {
      console.log(e);
    }
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
                onChange={(e: any): void => setConfirmPassword(e.target.value)}
                required
                value={confirmPassword}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={handleSubmit}>
            Update Password
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

export default AccountPassword;
