import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

import AccountProfile from './account-profile';
import AccountDetails from './account-details';
import AccountPassword from './account-password';
import Request from '../../util/request';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
}));

const Account: React.FC = () => {
  const classes = useStyles();
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(false);

  const loadData = async (): Promise<void> => {
    setLoading(true);

    try {
      const response: ServerResponse = await Request.get({ url: 'account/profile' });
      setData(response.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveData = async (updatedData: any) => {
    try {
      const response: ServerResponse = await Request.post({ url: '/account/profile', body: updatedData });
      console.log('saved!', response.data);
      setData(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpdateUser = (updatedData: any): void => {
    handleSaveData({
      data: {
        ...data,
        ...updatedData,
      },
    });
  };

  const handleSavePassword = async (body: { password: string; confirmPassword: string }) => {
    try {
      const response: ServerResponse = await Request.post({
        url: '/account/password',
        body,
      });

      // TODO: add toast messages & error handling
      alert('Updated');
      // TODO: Clear out password fields
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item lg={8} md={6} xl={8} xs={12}>
          <AccountDetails data={data} saveData={handleUpdateUser} isLoading={isLoading} />
          <AccountPassword saveData={handleSavePassword} isLoading={isLoading} />
        </Grid>
        <Grid item lg={4} md={6} xl={4} xs={12}>
          <AccountProfile />
        </Grid>
      </Grid>
    </div>
  );
};

export default Account;
