import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Card, CardHeader, CardContent, CardActions, Divider, Grid } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Form from '../../components/form/form';
import Button from '../../components/button/button';
import TextField from '../../components/text-field/text-field';

const useStyles = makeStyles((theme: Theme) => ({
  buttonGrid: {
    'margin-left': '0.75em',
  },
}));

const AccountPassword: React.FC<{ saveData: any; isLoading: boolean }> = ({ saveData, isLoading }) => {
  const classes = useStyles();

  const validationSchema = yup.object().shape({
    password: yup.string().required('Required'),
    confirmPassword: yup.string().required('Required'),
  });

  type FormData = { password: string; confirmPassword: string };

  const { handleSubmit, register, setValue, errors } = useForm<FormData>({
    validationSchema,
  });

  const formProps = { disabled: isLoading, errors, register, setValue, fullWidth: true };

  return (
    <Card>
      <Form autocomplete="off" disabled={isLoading} onSubmit={handleSubmit(saveData)}>
        <CardHeader title="Change Password" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField {...formProps} label="New Password" name="password" type="password" required />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField {...formProps} label="Confirm Password" name="confirmPassword" type="password" required />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12} className={classes.buttonGrid}>
              <Button {...formProps} type="submit">
                Update Password
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Form>
    </Card>
  );
};

export default AccountPassword;
