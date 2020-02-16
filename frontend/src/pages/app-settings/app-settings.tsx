import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Snackbar, SnackbarContent, Avatar } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';
import { useParams } from 'react-router-dom';
import Request from '../../util/request';

import ErrorList from '../../components/error-list/error-list';
import { parseCamelCase } from '../../util/helpers';
import MusicSettings from './music-settings';
import GoodreadsSettings from './goodreads-settings';
import PlayerFmSettings from './player-fm-settings';
import FeedlySettings from './feedly-settings';
import StatesSettings from './states-settings';
import GithubSettings from './github-settings';

const useStyles = makeStyles((theme: Theme) => ({
  snackbarContent: {
    color: theme.palette.secondary.main,
  },
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  content: {
    marginTop: theme.spacing(3),
  },
}));

const AppSettings: React.FC = () => {
  const { appName = '' } = useParams();
  const classes = useStyles();
  const [responseErrors, setResponseErrors] = useState<string[]>([]);
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadData = async (): Promise<void> => {
    setLoading(true);

    try {
      const response: ServerResponse = await Request.get({ url: '/app-config/config' });
      setData(response.data);
    } catch (e) {
      setResponseErrors(e);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (body: any): Promise<void> => {
    setResponseErrors([]);
    setSaveSuccess(false);

    try {
      const response: ServerResponse = await Request.post({ url: '/app-config/config', body });
      setData(response.data);
      setSaveSuccess(true);
    } catch (e) {
      setResponseErrors(e);
    }
  };

  const submit = (formData: FormData): void => {
    const toSave = {
      ...data,
      [appName]: {
        ...data[appName],
        ...formData,
      },
    };

    setData(toSave);
    saveData(toSave);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const baseAppProps = {
    submit,
    isLoading,
  };

  return (
    <>
      <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={saveSuccess}
        onClose={(): void => {
          setSaveSuccess(false);
        }}
      >
        <SnackbarContent className={classes.snackbarContent} message={<span>Saved settings</span>} />
      </Snackbar>

      <Container component="main" maxWidth="xs">
        <Box mt={5}>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <SettingsIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {parseCamelCase(appName)} Settings
            </Typography>
            <div className={classes.content}>
              <ErrorList errors={responseErrors} />
              {
                ({
                  music: <MusicSettings data={data && data.music} {...baseAppProps} />,
                  goodreads: <GoodreadsSettings data={data && data.goodreads} {...baseAppProps} />,
                  feedly: <FeedlySettings data={data && data.feedly} {...baseAppProps} />,
                  playerFm: <PlayerFmSettings data={data && data.playerFm} {...baseAppProps} />,
                  states: <StatesSettings data={data && data.states} {...baseAppProps} />,
                  github: <GithubSettings data={data && data.github} {...baseAppProps} />,
                } as any)[appName]
              }
            </div>
          </div>
        </Box>
      </Container>
    </>
  );
};

export default AppSettings;
