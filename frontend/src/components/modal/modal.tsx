import React, { ReactElement } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Modal as MaterialModal } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    backdrop: {
      background: theme.palette.background.default,
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      outline: 0,
      borderRadius: 5,
      padding: theme.spacing(2, 4, 3),
    },
  })
);

export interface ModalProps {
  open: boolean;
  title: string;
  handleClose: any;
  children: ReactElement;
}

const Modal: React.FC<ModalProps> = ({ open, handleClose, title, children }) => {
  const classes = useStyles();

  return (
    <MaterialModal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 250,
        classes: {
          root: classes.backdrop,
        },
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          {title && <h2 id="transition-modal-title">{title}</h2>}
          {children}
        </div>
      </Fade>
    </MaterialModal>
  );
};

export default Modal;
