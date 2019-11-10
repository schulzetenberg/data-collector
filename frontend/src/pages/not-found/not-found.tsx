import React from 'react';
import Icon from '@material-ui/core/Icon';
import Box from '@material-ui/core/Box';
import ErrorIcon from '@material-ui/icons/Error';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  icon: {
    marginBottom: theme.spacing(4),
    width: 80,
    height: 80,
    textAlign: 'center',
  },
  iconSvg: {
    width: '100%',
    height: '100%',
    fill: theme.palette.error.main,
  },
}));

const NotFound: React.FC = () => {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <Box mt={5}>
        <Typography variant="h1" component="h1" align="center" gutterBottom>
          404
        </Typography>
        <div className={classes.paper}>
          <Icon className={classes.icon}>
            <ErrorIcon className={classes.iconSvg} />
          </Icon>
          <Typography component="h1" variant="h6">
            Page Not Found
          </Typography>
        </div>
      </Box>
    </Container>
  );
};

export default NotFound;
