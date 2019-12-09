import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardHeader, CardContent, CardActions, Divider, Grid, Button, TextField } from '@material-ui/core';

const useStyles = makeStyles(() => ({}));

const AccountDetails: React.FC<{ data: any; updateProfile: any; updateData: any; saveData: any }> = ({
  data,
  updateProfile,
  updateData,
  saveData,
}) => {
  const classes = useStyles();
  const isLoading = false; // TODO

  return (
    <Card>
      <form>
        <CardHeader title="Profile" />
        <Divider />
        {data && (
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="First Name"
                  margin="dense"
                  name="firstName"
                  disabled={isLoading}
                  onChange={updateProfile}
                  required
                  value={data.profile.firstName}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Last Name"
                  margin="dense"
                  name="lastName"
                  disabled={isLoading}
                  onChange={updateProfile}
                  required
                  value={data.profile.lastName}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  margin="dense"
                  name="email"
                  disabled={isLoading}
                  type="email"
                  onChange={updateData}
                  required
                  value={data.email}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </CardContent>
        )}
        <CardActions>
          <Button color="primary" variant="contained" onClick={saveData} disabled={isLoading}>
            Save Changes
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

export default AccountDetails;
