import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardActions, CardContent, Avatar, Typography, Divider, Button } from '@material-ui/core';

import Modal from '../../components/modal/modal';

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
  progress: {
    marginTop: theme.spacing(2),
  },
  uploadButton: {
    marginRight: theme.spacing(2),
  },
  modalButton: {
    marginRight: theme.spacing(2),
    float: 'right',
  },
}));

const AccountProfile = () => {
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
              Account Created 11/22/2019
            </Typography>
          </div>
          <Avatar className={classes.avatar} src={user.avatar} />
        </div>
        <Button className={classes.uploadButton} color="primary" variant="text">
          Upload picture
        </Button>
        <Button variant="text">Remove picture</Button>
      </CardContent>
      <Divider />
      <CardActions>
        <Button className={classes.uploadButton} color="primary" variant="contained" onClick={handleDelete}>
          Delete Account
        </Button>
      </CardActions>
      {open && (
        <Modal title="Delete Account" open={open} handleClose={handleClose}>
          <p>
            If you delete your account, all data related to your account will be <strong>permanently deleted</strong>.
            Are you sure you want to proceed?
          </p>
          <Button className={classes.modalButton} color="primary" variant="contained">
            Confirm
          </Button>
          <Button className={classes.modalButton} onClick={handleClose} color="primary" variant="text">
            Cancel
          </Button>
        </Modal>
      )}
    </Card>
  );
};

export default AccountProfile;
