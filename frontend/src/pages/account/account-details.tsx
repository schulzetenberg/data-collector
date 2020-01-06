import React, { useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Card, CardHeader, CardContent, CardActions, Divider, Grid } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Form from '../../components/form/form';
import Button from '../../components/button/button';
import TextField from '../../components/text-field/text-field';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonGrid: {
      'margin-left': '0.75em',
    },
  })
);

const AccountDetails: React.FC<{ data: any; saveData: any; isLoading: boolean }> = ({ data, saveData, isLoading }) => {
  const classes = useStyles();

  const validationSchema = yup.object().shape({
    firstName: yup.string().required('Required'),
    lastName: yup.string().required('Required'),
    email: yup
      .string()
      .required('Required')
      .email('Invalid email'),
  });

  type FormData = { firstName: string; lastName: string; email: string };

  const { handleSubmit, register, setValue, errors, reset } = useForm<FormData>({
    validationSchema,
  });

  const formProps = { disabled: isLoading, errors, register, setValue, fullWidth: true };

  useEffect(() => {
    if (data) {
      reset({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });
    }
  }, [data, reset]);

  return (
    <Card>
      <CardHeader title="Edit Profile" />
      <Divider />

      <Form disabled={isLoading} onSubmit={handleSubmit(saveData)}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <TextField {...formProps} label="First Name" name="firstName" required />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField {...formProps} label="Last Name" name="lastName" required />
            </Grid>
            <Grid item xs={12}>
              <TextField {...formProps} label="Email Address" name="email" type="email" required />
            </Grid>
          </Grid>
        </CardContent>

        <CardActions>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12} className={classes.buttonGrid}>
              <Button {...formProps} type="submit">
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Form>
    </Card>
  );
};

export default AccountDetails;
