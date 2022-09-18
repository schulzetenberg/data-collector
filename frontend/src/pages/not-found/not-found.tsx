import React from 'react';
import Icon from '@mui/material/Icon';
import Box from '@mui/material/Box';
import ErrorIcon from '@mui/icons-material/Error';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import Container from '@mui/material/Container';

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
