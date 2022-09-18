import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Card, CardActions, CardContent, Avatar, Typography, Divider, Grid } from '@mui/material';

import { ErrorList, Modal, Button } from '@schulzetenberg/component-library';

const useStyles = makeStyles((theme) => ({
  details: {
    display: 'flex',
  },
  avatar: {
    marginLeft: 'auto',
    height: 100,
    width: 100,
    flexShrink: 0,
    flexGrow: 0,
  },
  uploadButton: {
    marginRight: theme.spacing(2),
  },
  modalButtonConfirm: {
    float: 'right',
  },
}));

const AccountProfile: React.FC<{
  data?: any;
  handleRemove: any;
  isLoading: boolean;
  errors: string[];
  setShowProfile: any;
  setShowPassword: any;
}> = ({ data, handleRemove, isLoading, errors, setShowProfile, setShowPassword }) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleDelete = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <Card>
      <CardContent>
        <div className={classes.details}>
          <div>
            <Typography gutterBottom variant="h2">
              {data?.firstName} {data?.lastName}
            </Typography>
            <Typography color="textSecondary" variant="body1">
              {data?.email}
            </Typography>
            <Typography color="textSecondary" variant="body1">
              Account created on {data?.createdAt}
            </Typography>
          </div>
          <Avatar className={classes.avatar} src={data?.gravatar} title={`Gravatar for ${data?.email}`} />
        </div>
        <br />
        <Button variant="text" className={classes.uploadButton} onClick={setShowProfile}>
          Edit Profile
        </Button>
        <Button variant="text" className={classes.uploadButton} onClick={setShowPassword}>
          Change Password
        </Button>
      </CardContent>
      <Divider />
      <CardActions>
        <Grid container alignItems="flex-start" justifyContent="flex-end" direction="row">
          <Button className={classes.uploadButton} color="primary" variant="contained" onClick={handleDelete}>
            Delete Account
          </Button>
        </Grid>
      </CardActions>
      {open && (
        <Modal title="Delete Account" open={open} handleClose={handleClose}>
          <>
            <ErrorList errors={errors} />
            <p>
              If you delete your account, all data related to your account will be <strong>permanently deleted</strong>.
              Are you sure you want to proceed?
            </p>
            <Button
              disabled={isLoading}
              className={classes.modalButtonConfirm}
              onClick={handleRemove}
              color="primary"
              variant="contained"
            >
              Confirm
            </Button>
            <Button disabled={isLoading} onClick={handleClose} color="primary" variant="text">
              Cancel
            </Button>
          </>
        </Modal>
      )}
    </Card>
  );
};

export default AccountProfile;
