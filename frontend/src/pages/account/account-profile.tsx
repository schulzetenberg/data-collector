import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardActions, CardContent, Avatar, Typography, Divider, Button, Grid } from '@material-ui/core';

import Modal from '../../components/modal/modal';
import ErrorList from '../../components/error-list/error-list';

const useStyles = makeStyles((theme) => ({
  details: {
    display: 'flex',
  },
  avatar: {
    marginLeft: 'auto',
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0,
  },
  uploadButton: {
    marginRight: theme.spacing(2),
  },
  modalButton: {
    marginRight: theme.spacing(2),
    float: 'right',
  },
}));

const AccountProfile: React.FC<{
  handleRemove: any;
  isLoading: boolean;
  errors: string[];
  setShowProfile: any;
  setShowPassword: any;
}> = ({ handleRemove, isLoading, errors, setShowProfile, setShowPassword }) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleDelete = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const user = {
    avatar: '/avatar_11.png',
  };

  return (
    <Card>
      <CardContent>
        <div className={classes.details}>
          <div>
            <Typography gutterBottom variant="h2">
              John Doe
            </Typography>
            <Typography color="textSecondary" variant="body1">
              admin@1.com
            </Typography>
            <Typography color="textSecondary" variant="body1">
              Account created on 11/22/2019
            </Typography>
          </div>
          <Avatar className={classes.avatar} src={user.avatar} />
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
        <Grid container alignItems="flex-start" justify="flex-end" direction="row">
          <Button className={classes.uploadButton} color="primary" variant="contained" onClick={handleDelete}>
            Delete Account
          </Button>
        </Grid>
      </CardActions>
      {open && (
        <Modal title="Delete Account" open={open} handleClose={handleClose}>
          <ErrorList errors={errors} />
          <p>
            If you delete your account, all data related to your account will be <strong>permanently deleted</strong>.
            Are you sure you want to proceed?
          </p>
          <Button
            disabled={isLoading}
            className={classes.modalButton}
            onClick={handleRemove}
            color="primary"
            variant="contained"
          >
            Confirm
          </Button>
          <Button
            disabled={isLoading}
            className={classes.modalButton}
            onClick={handleClose}
            color="primary"
            variant="text"
          >
            Cancel
          </Button>
        </Modal>
      )}
    </Card>
  );
};

export default AccountProfile;
