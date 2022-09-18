import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Card, Container, CardHeader, CardContent, Divider, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Button, Form, TextField2, useValidation } from '@schulzetenberg/component-library';

const useStyles = makeStyles((theme) => ({
  buttonGrid: {
    marginTop: theme.spacing(2),
  },
}));

const AccountPassword: React.FC<{ saveData: any; handleCancel?: any; isLoading: boolean }> = ({
  saveData,
  handleCancel,
  isLoading,
}) => {
  const classes = useStyles();

  const validationSchema = yup.object().shape({
    password: yup.string().required('Required'),
    confirmPassword: yup.string().required('Required'),
  });

  type FormData = { password: string; confirmPassword: string };
  const resolver = useValidation(validationSchema);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({ resolver });

  const formProps = { disabled: isLoading, control, errors, fullWidth: true };

  return (
    <Container maxWidth="sm">
      <Card>
        <Form autocomplete="off" disabled={isLoading} onSubmit={handleSubmit(saveData)}>
          <CardHeader title="Change Password" />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField2 {...formProps} label="New Password" name="password" type="password" required />
              </Grid>
              <Grid item xs={12}>
                <TextField2 {...formProps} label="Confirm Password" name="confirmPassword" type="password" required />
              </Grid>
            </Grid>
            {handleCancel && (
              <Grid item xs={12} className={classes.buttonGrid}>
                <Button {...formProps} variant="text" onClick={handleCancel}>
                  Cancel
                </Button>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button {...formProps} type="submit">
                Update Password
              </Button>
            </Grid>
          </CardContent>
        </Form>
      </Card>
    </Container>
  );
};

export default AccountPassword;
