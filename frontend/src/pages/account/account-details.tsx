import React, { useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Card, Container, CardHeader, CardContent, Divider, Grid } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Button, Form, TextField2, useValidation } from '@schulzetenberg/component-library';

const useStyles = makeStyles((theme) =>
  createStyles({
    buttonGrid: {
      marginTop: theme.spacing(2),
    },
  })
);

const AccountDetails: React.FC<{ data: any; saveData: any; handleCancel: any; isLoading: boolean }> = ({
  data,
  saveData,
  handleCancel,
  isLoading,
}) => {
  const classes = useStyles();

  const validationSchema = yup.object().shape({
    firstName: yup.string().required('Required'),
    lastName: yup.string().required('Required'),
    email: yup.string().required('Required').email('Invalid email'),
  });

  type FormData = { firstName: string; lastName: string; email: string };
  const resolver = useValidation(validationSchema);
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver });
  const formProps = { disabled: isLoading, control, errors, fullWidth: true };

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
    <Container maxWidth="sm">
      <Card>
        <CardHeader title="Edit Profile" />
        <Divider />

        <Form disabled={isLoading} onSubmit={handleSubmit(saveData)}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField2 {...formProps} label="First Name" name="firstName" required />
              </Grid>
              <Grid item xs={12}>
                <TextField2 {...formProps} label="Last Name" name="lastName" required />
              </Grid>
              <Grid item xs={12}>
                <TextField2 {...formProps} label="Email Address" name="email" type="email" required />
              </Grid>
            </Grid>
            <Grid item xs={12} className={classes.buttonGrid}>
              <Button {...formProps} variant="text" onClick={handleCancel}>
                Cancel
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button {...formProps} type="submit">
                Save Changes
              </Button>
            </Grid>
          </CardContent>
        </Form>
      </Card>
    </Container>
  );
};

export default AccountDetails;
