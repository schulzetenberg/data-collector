/* eslint-disable react/jsx-props-no-spreading */

import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Grid, Snackbar, SnackbarContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

import Request from '../../util/request';
import AppCard from './app-card';
import ErrorList from '../../components/error-list/error-list';

const useStyles = makeStyles((theme) => ({
  snackbarContent: {
    color: theme.palette.secondary.main,
  },
}));

const AppConfig: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const [errors, setErrors] = useState<string[]>([]);
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const messageConstants = {
    saveSuccess: 'Saved config',
    runSuccess: 'App ran successfully',
  };

  const loadData = async (): Promise<void> => {
    setLoading(true);

    try {
      const response: ServerResponse = await Request.get({ url: 'app-config/config' });
      setData(response.data);
    } catch (e) {
      setErrors(e);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (body: any): Promise<void> => {
    setSuccessMessage('');

    try {
      const response: ServerResponse = await Request.post({ url: '/app-config/config', body });
      setData(response.data);
      setSuccessMessage(messageConstants.saveSuccess);
    } catch (e) {
      setErrors(e);
    }
  };

  const handleUpdateSettings = (app: string): void => {
    history.push(`/app-settings/${app}`);
  };

  const handleManualUpdate = async (appName: string) => {
    try {
      const response: ServerResponse = await Request.post({ url: '/app-config/run-app', body: { app: appName } });
      setSuccessMessage(messageConstants.runSuccess);
    } catch (e) {
      setErrors(e);
    }
  };

  const handleUpdateStatus = (appKey: string, checked: boolean) => {
    const toSave = {
      ...data,
      [appKey]: {
        ...data[appKey],
        active: checked,
      },
    };

    setData(toSave);
    saveData(toSave);
  };

  useEffect(() => {
    loadData();
  }, []);

  const cardDefaultProps = {
    updateStatus: handleUpdateStatus,
    updateSettings: handleUpdateSettings,
    manuallyUpdate: handleManualUpdate,
    isLoading,
  };

  return (
    <>
      <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={!!successMessage}
        onClose={(): void => {
          setSuccessMessage('');
        }}
      >
        <SnackbarContent className={classes.snackbarContent} message={<span>{successMessage}</span>} />
      </Snackbar>

      <Container maxWidth="sm">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            App Config
          </Typography>
          <ErrorList errors={errors} />
          <Grid container spacing={3}>
            <AppCard
              appKey="music"
              active={data && data.music.active}
              {...cardDefaultProps}
              title="Music"
              image="/img/music.jpg"
              lastUpdated={data && data.music.lastUpdated}
              summary="Collect music listening habits from Spotify & LastFM"
              description="The data being collected includes the top 15 artists, total number of artists, and number of songs listened to in the past 12 months."
            />

            <AppCard
              appKey="goodreads"
              active={data && data.goodreads.active}
              {...cardDefaultProps}
              title="Books"
              image="/img/books.jpg"
              lastUpdated={data && data.goodreads.lastUpdated}
              summary="Collect data on the books read from Goodreads"
              description="The data being collected includes the book title, date read, rating, cover image link, number of pages, and number of times read"
            />

            <AppCard
              appKey="fuelly"
              active={data && data.fuelly.active}
              {...cardDefaultProps}
              title="Driving"
              image="/img/driving.jpg"
              lastUpdated={data && data.fuelly.lastUpdated}
              summary="Collect mileage and fuel data from Fuelly"
              description="The data being collected includes the miles driven, amount of fuel consumed, and cost of fuel per vehicle"
            />

            <AppCard
              appKey="github"
              active={data && data.github.active}
              {...cardDefaultProps}
              title="Software Contributions"
              image="/img/coding.jpg"
              lastUpdated={data && data.github.lastUpdated}
              summary="Collect software contribution data from Github"
              description="The data being collected includes a user's number of repos, contributions graphic, and follower & following lists"
            />

            <AppCard
              appKey="playerFm"
              active={data && data.playerFm.active}
              {...cardDefaultProps}
              title="Podcasts"
              image="/img/microphone.jpg"
              lastUpdated={data && data.playerFm.lastUpdated}
              summary="Collect podcast subscriptions from PlayerFM"
            />

            <AppCard
              appKey="tmdb"
              active={data && data.tmdb.active}
              {...cardDefaultProps}
              title="Media Artwork"
              image="/img/theatre.jpg"
              lastUpdated={data && data.tmdb.lastUpdated}
              summary="Collect images of TV shows & movies using TMDB"
            />

            <AppCard
              appKey="states"
              {...cardDefaultProps}
              title="States"
              image="/img/usa.jpg"
              summary="Track the states that have been visited and yet to be visited"
            />

            <AppCard
              appKey="countries"
              {...cardDefaultProps}
              title="Countries"
              image="/img/globe.jpg"
              summary="Track the countries that have been visited and yet to be visited"
            />

            <AppCard
              appKey="feedly"
              active={data && data.feedly.active}
              {...cardDefaultProps}
              title="Blogs"
              image="/img/blog.jpg"
              lastUpdated={data && data.feedly.lastUpdated}
              summary="Collect Blog subscriptions from Feedly"
            />

            <AppCard
              appKey="trakt"
              active={data && data.trakt.active}
              {...cardDefaultProps}
              title="TV & Movies"
              image="/img/movie.jpg"
              lastUpdated={data && data.trakt.lastUpdated}
              summary="Collect TV & movie viewing data from Trakt"
              description="The data being collected includes the number of episodes & movies, ratings, and time spent watching"
            />

            <AppCard
              appKey="instagram"
              active={data && data.instagram.active}
              {...cardDefaultProps}
              title="Instagram"
              image="/img/phone.jpg"
              lastUpdated={data && data.instagram.lastUpdated}
              summary="Collect public Instagram images"
            />
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default AppConfig;
