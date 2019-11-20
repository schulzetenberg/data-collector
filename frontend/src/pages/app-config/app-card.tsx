import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import { Grid, Menu, MenuItem } from '@material-ui/core';

import Switch from '../../components/switch/switch';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      maxWidth: 345,
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: red[500],
      fontSize: '.8rem',
      borderRadius: '50%',
    },
  })
);

const AppCard: React.FC = ({ handleUpdateStataus }: any) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExpandClick = (): void => {
    setExpanded(!expanded);
  };

  return (
    <Grid item sm={12} md={6}>
      <Card className={classes.card}>
        <CardHeader
          avatar={<Switch />}
          action={
            <div>
              <IconButton aria-label="settings" onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={handleClose}>Edit Settings</MenuItem>
                <MenuItem onClick={handleClose}>Run Manual Update</MenuItem>
              </Menu>
            </div>
          }
          title="Music"
          subheader="Data updated 1 day ago"
        />
        <CardMedia className={classes.media} image="/img/music.jpg" title="Music Image" />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            Collect music listening habits from Spotify & LastFM
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>
              The data being collected includes the top 15 artists, total number of artists, and number of songs
              listened to in the past 12 months.
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </Grid>
  );
};

export default AppCard;

// TODO: make this generic and expose these props: Image, title, lastUpdated, description
