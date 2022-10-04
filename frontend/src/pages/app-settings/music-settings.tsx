import React, { useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useForm } from 'react-hook-form';

import { Button, Form, TextField2, SwitchForm2 } from '@schulzetenberg/component-library';

const useStyles = makeStyles(() => ({
  textCenter: { textAlign: 'center' },
}));

type FormData = {
  active: boolean;
  schedule: string;
  spotifySecret: string;
  spotifyId: string;
  lastFmKey: string;
  lastFmUsername: string;
  cloudinaryUpload: boolean;
};

const MusicSettings: React.FC<{ data: FormData; isLoading: boolean; submit: (formData: FormData) => void }> = ({
  data,
  isLoading,
  submit,
}) => {
  const classes = useStyles();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const formProps = { disabled: isLoading, control, errors, fullWidth: true };

  useEffect(() => {
    if (data) {
      const { active, schedule, spotifySecret, spotifyId, lastFmKey, lastFmUsername, cloudinaryUpload } = data;

      reset({
        active,
        schedule,
        spotifySecret,
        spotifyId,
        lastFmKey,
        lastFmUsername,
        cloudinaryUpload,
      });
    }
  }, [data, reset]);

  return (
    <Form disabled={formProps.disabled} onSubmit={handleSubmit(submit)}>
      <div className={classes.textCenter}>
        <SwitchForm2 {...formProps} name="active" label="Active" />
      </div>
      <TextField2 {...formProps} name="schedule" label="Schedule" type="text" autoFocus />
      <TextField2 {...formProps} name="spotifySecret" label="Spotify Secret" type="text" />
      <TextField2 {...formProps} name="spotifyId" label="Spotify ID" type="text" />
      <TextField2 {...formProps} name="lastFmKey" label="LastFM Key" type="text" />
      <TextField2 {...formProps} name="lastFmUsername" label="LastFM Username" type="text" />
      <div className={classes.textCenter}>
        <SwitchForm2 {...formProps} name="cloudinaryUpload" label="Upload Images to Cloudinary" />
      </div>
      <Button {...formProps} type="submit">
        Save
      </Button>
    </Form>
  );
};

export default MusicSettings;
