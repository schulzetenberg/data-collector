import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Snackbar, SnackbarContent, Avatar } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Request from '../../util/request';

import Button from '../../components/button/button';
import Form from '../../components/form/form';
import TextField from '../../components/text-field/text-field';

import ErrorList from '../../components/error-list/error-list';
import SwitchForm from '../../components/switch/switch-form';
import { parseCamelCase } from '../../util/helpers';

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
  textCenter: { textAlign: 'center' },
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

  const submit = (formData: FormData) => {
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
  }, []);

  type FormData = {
    active: boolean;
    schedule: string;
    spotifySecret: string;
    spotifyId: string;
    lastFmKey: string;
  };

  const { handleSubmit, register, setValue, errors, reset } = useForm<FormData>();

  const formProps = { disabled: isLoading, errors, register, setValue, fullWidth: true };

  useEffect(() => {
    if (data && appName && data[appName]) {
      const { active, schedule, spotifySecret, spotifyId, lastFmKey } = data[appName];

      reset({
        active,
        schedule,
        spotifySecret,
        spotifyId,
        lastFmKey,
      });
    }
  }, [appName, data, reset]);

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
              {appName === 'music' && (
                <Form disabled={formProps.disabled} onSubmit={handleSubmit(submit)}>
                  <div className={classes.textCenter}>
                    <SwitchForm {...formProps} name="active" label="Active" />
                  </div>
                  <TextField {...formProps} name="schedule" label="Schedule" type="text" autoFocus />
                  <TextField {...formProps} name="spotifySecret" label="Spotify Secret" type="text" />
                  <TextField {...formProps} name="spotifyId" label="Spotify ID" type="text" />
                  <TextField {...formProps} name="lastFmKey" label="LastFM Key" type="text" />
                  <Button {...formProps} type="submit">
                    Save
                  </Button>
                </Form>
              )}
            </div>
          </div>
        </Box>
      </Container>
    </>
  );
};

export default AppSettings;
