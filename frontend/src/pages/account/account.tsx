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

  const loadData = async (): Promise<void> => {
    try {
      const response: ServerResponse = await Request.get({ url: 'account/profile' });
      setData(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateProfile = (e: any): void => {
    setData({
      ...data,
      profile: {
        ...data.profile,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleUpdateData = (e: any): void => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveData = async () => {
    try {
      const response: ServerResponse = await Request.post({ url: 'account/profile', body: data });
      alert('saved!');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item lg={8} md={6} xl={8} xs={12}>
          <AccountDetails
            data={data}
            updateProfile={handleUpdateProfile}
            updateData={handleUpdateData}
            saveData={handleSaveData}
          />
          <AccountPassword />
        </Grid>
        <Grid item lg={4} md={6} xl={4} xs={12}>
          <AccountProfile />
        </Grid>
      </Grid>
    </div>
  );
};

export default Account;
