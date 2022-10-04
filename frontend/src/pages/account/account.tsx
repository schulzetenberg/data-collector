import React, { useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Grid } from '@mui/material';
import { useHistory } from 'react-router-dom';

import { ErrorList, SessionContext, Request } from '@schulzetenberg/component-library';

import AccountProfile from './account-profile';
import AccountDetails from './account-details';
import AccountPassword from './account-password';
import AccountTokens from './account-tokens';
import { CatchResponse, ServerResponse } from '../../types/response';
import { Profile, Token } from '../../types/account';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
}));

const Account: React.FC = () => {
  const classes = useStyles();
  const [data, setData] = useState<Profile>();
  const history = useHistory();
  const { setSession } = React.useContext(SessionContext);
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [isRemoveLoading, setRemoveLoading] = useState(false);
  const [removeErrors, setRemoveErrors] = useState<string[]>([]);

  const [isLoadingPassword, setLoadingPassword] = useState(false);

  const loadData = async (): Promise<void> => {
    setLoading(true);

    try {
      const { data: response }: ServerResponse = await Request.get({ url: 'account/profile' });
      setData(response.data);
    } catch (e) {
      setServerErrors(e as CatchResponse);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveData = async (updatedData: any): Promise<void> => {
    setLoading(true);

    try {
      const { data: response }: ServerResponse = await Request.post({ url: '/account/profile', body: updatedData });
      setData(response.data);
      setShowProfile(false);
    } catch (e) {
      setServerErrors(e as CatchResponse);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = (updatedData: any): void => {
    handleSaveData({
      ...data,
      ...updatedData,
    });
  };

  const handleCancel = (): void => {
    setShowProfile(false);
    setShowPassword(false);
  };

  const handleShowProfile = (): void => {
    setShowPassword(false);
    setShowProfile(!showProfile);
  };

  const handleShowPassword = (): void => {
    setShowPassword(!showPassword);
    setShowProfile(false);
  };

  const handleSavePassword = async (body: { password: string; confirmPassword: string }): Promise<void> => {
    setLoadingPassword(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data: response }: ServerResponse = await Request.post({
        url: '/account/password',
        body,
      });

      // TODO: add toast messages & error handling
      alert('Updated');
      // TODO: Clear out password fields
    } catch (e) {
      setServerErrors(e as CatchResponse);
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleRemove = async (): Promise<void> => {
    setRemoveErrors([]);
    setRemoveLoading(true);

    try {
      const { data: response }: ServerResponse = await Request.post({ url: '/account/delete' });
      setSession();
      history.push('/sign-in');
      setRemoveErrors(response.errors);
    } catch (e) {
      setRemoveLoading(false);
      setRemoveErrors(e as CatchResponse);
    }
  };

  const handleUpdateTokens = (tokens: Token[]): void => {
    setData(
      (prev) =>
        prev && {
          ...prev,
          tokens,
        }
    );
  };

  return (
    <div className={classes.root}>
      <ErrorList errors={serverErrors} />
      <Grid container spacing={4} justifyContent="center">
        {(showProfile || showPassword) && (
          <Grid item sm={12} md={6}>
            {showProfile && (
              <AccountDetails
                data={data}
                saveData={handleUpdateUser}
                handleCancel={handleCancel}
                isLoading={isLoading}
              />
            )}

            {showPassword && (
              <AccountPassword
                saveData={handleSavePassword}
                handleCancel={handleCancel}
                isLoading={!data || isLoadingPassword}
              />
            )}
          </Grid>
        )}

        {!showProfile && !showPassword && (
          <Grid item lg={4} md={6} xl={4} xs={12}>
            <AccountProfile
              handleRemove={handleRemove}
              isLoading={!data || isRemoveLoading}
              data={data}
              errors={removeErrors}
              setShowProfile={handleShowProfile}
              setShowPassword={handleShowPassword}
            />
            <AccountTokens tokens={data?.tokens} updateTokens={handleUpdateTokens} isLoading={!data} />
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default Account;
