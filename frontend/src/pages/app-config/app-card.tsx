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
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import { Grid, Menu, MenuItem, Box } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

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
  })
);

interface AppCardProps {
  appKey: string;
  isLoading: boolean;
  title: string;
  active?: boolean;
  image: string;
  lastUpdated?: string;
  summary: string;
  description?: string;
  updateSettings: Function;
  updateStatus: Function;
  manuallyUpdate: Function;
}

const AppCard: React.FC<AppCardProps> = ({
  appKey,
  isLoading,
  title,
  active,
  image,
  lastUpdated,
  summary,
  description,
  updateSettings,
  updateStatus,
  manuallyUpdate,
}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleEditSettings = (): void => {
    handleClose();
    updateSettings(appKey);
  };

  const handleManualUpdate = (): void => {
    handleClose();
    manuallyUpdate(appKey);
  };

  const handleExpandClick = (): void => {
    setExpanded(!expanded);
  };

  const handleActiveChange = (e: any): void => {
    updateStatus(appKey, e.target.checked);
  };

  return (
    <Grid item sm={12} md={6}>
      <Card className={classes.card}>
        <CardHeader
          avatar={
            isLoading ? (
              <Skeleton variant="circle" width={40} height={30} />
            ) : (
              // TODO: Change Switch component to SwitchForm
              active !== undefined && <Switch onChange={handleActiveChange} checked={active} />
            )
          }
          action={
            !isLoading && (
              <div>
                <IconButton aria-label="settings" onClick={handleClick}>
                  <MoreVertIcon />
                </IconButton>
                <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                  <MenuItem onClick={handleEditSettings}>Edit Settings</MenuItem>
                  <MenuItem onClick={handleManualUpdate}>Run Manual Update</MenuItem>
                </Menu>
              </div>
            )
          }
          title={isLoading ? <Skeleton height={10} width="80%" style={{ marginBottom: 6 }} /> : title}
          subheader={isLoading ? <Skeleton height={10} width="40%" /> : lastUpdated && `Data updated ${lastUpdated}`}
        />

        {isLoading ? (
          <Skeleton variant="rect" className={classes.media} />
        ) : (
          <CardMedia className={classes.media} image={image} title={`${title} image`} />
        )}

        <CardContent>
          {isLoading ? (
            <>
              <Skeleton height={10} style={{ marginBottom: 10 }} />
              <Skeleton height={10} width="80%" />
            </>
          ) : (
            <Typography variant="body2" color="textSecondary" component="p">
              {summary}
            </Typography>
          )}
        </CardContent>

        <CardActions disableSpacing>
          {description &&
            (isLoading ? (
              <Box my={4} />
            ) : (
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
            ))}
        </CardActions>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>{description}</Typography>
          </CardContent>
        </Collapse>
      </Card>
    </Grid>
  );
};

export default AppCard;
