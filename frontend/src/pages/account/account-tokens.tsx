import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';

import ErrorList from '../../components/error-list/error-list';
import Request from '../../util/request';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: theme.spacing(4),
  },
}));

const AccountTokens: React.FC<{
  tokens: any;
  updateTokens: any;
  saveData: any;
  isLoading: boolean;
}> = ({ tokens, updateTokens, isLoading }) => {
  const [isTokenLoading, setTokenLoading] = useState(false);
  const [tokenErrors, setTokenErrors] = useState<string[]>([]);
  const classes = useStyles();

  const addToken = async () => {
    setTokenErrors([]);
    setTokenLoading(true);

    try {
      const response: ServerResponse = await Request.get({ url: '/account/api-key' });
      if (response.errors) {
        setTokenErrors(response.errors);
      } else {
        updateTokens(response.data);
      }
    } catch (e) {
      setTokenErrors(e);
    } finally {
      setTokenLoading(false);
    }
  };

  return (
    <div className={classes.wrapper}>
      <ErrorList errors={tokenErrors} />
      <MaterialTable
        options={{
          search: false,
        }}
        isLoading={isLoading || isTokenLoading}
        actions={[
          {
            icon: 'add_box',
            tooltip: 'Add',
            isFreeAction: true,
            onClick: (): Promise<void> => addToken(),
          },
        ]}
        columns={[
          { title: 'Token', field: 'token' },
          { title: 'Created', field: 'createdAt' },
        ]}
        data={tokens}
        title="API Keys"
      />
    </div>
  );
};

export default AccountTokens;
