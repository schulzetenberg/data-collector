import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import { SessionContext } from '../../util/session-context';
import AccountProfile from './account-profile';
import AccountDetails from './account-details';
import AccountPassword from './account-password';
import Request from '../../util/request';
import ErrorList from '../../components/error-list/error-list';
import AccountTokens from './account-tokens';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
}));

const Account: React.FC = () => {
  const classes = useStyles();
  const [data, setData] = useState();
  const history = useHistory();
  const { session, setSession }: any = React.useContext(SessionContext);
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
      const response: ServerResponse = await Request.get({ url: 'account/profile' });
      setData(response.data);
    } catch (e) {
      setServerErrors(e);
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
      const response: ServerResponse = await Request.post({ url: '/account/profile', body: updatedData });
      setData(response.data);
      setShowProfile(false);
    } catch (e) {
      setServerErrors(e);
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
      const response: ServerResponse = await Request.post({
        url: '/account/password',
        body,
      });

      // TODO: add toast messages & error handling
      alert('Updated');
      // TODO: Clear out password fields
    } catch (e) {
      setServerErrors(e);
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleRemove = async (): Promise<void> => {
    setRemoveErrors([]);
    setRemoveLoading(true);

    try {
      const response: ServerResponse = await Request.post({ url: '/account/delete' });
      setSession();
      history.push('/sign-in');
      setRemoveErrors(response.errors);
    } catch (e) {
      setRemoveLoading(false);
      setRemoveErrors(e);
    }
  };

  const handleUpdateTokens = (tokens: any): void => {
    setData({
      ...data,
      tokens,
    });
  };

  return (
    <div className={classes.root}>
      <ErrorList errors={serverErrors} />
      <Grid container spacing={4}>
        {(showProfile || showPassword) && (
          <Grid item lg={8} md={6} xl={8} xs={12}>
            {showProfile && <AccountDetails data={data} saveData={handleUpdateUser} isLoading={isLoading} />}
            {showPassword && <AccountPassword saveData={handleSavePassword} isLoading={!data || isLoadingPassword} />}
          </Grid>
        )}
        {!showProfile && !showPassword && <Grid item lg={4} md={3} xl={4} xs={12} />}
        <Grid item lg={4} md={6} xl={4} xs={12}>
          <AccountProfile
            handleRemove={handleRemove}
            isLoading={!data || isRemoveLoading}
            errors={removeErrors}
            setShowProfile={handleShowProfile}
            setShowPassword={handleShowPassword}
          />
          <AccountTokens
            tokens={data && data.tokens}
            updateTokens={handleUpdateTokens}
            saveData={handleUpdateUser}
            isLoading={!data}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Account;
