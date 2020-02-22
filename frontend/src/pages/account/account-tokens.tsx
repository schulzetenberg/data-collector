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

type Token = { _id?: string; token: string; createdAt: string; tableData?: { id: number } };

const AccountTokens: React.FC<{
  tokens: Token[];
  updateTokens: any;
  saveData: any;
  isLoading: boolean;
}> = ({ tokens, updateTokens, isLoading }) => {
  const [isTokenLoading, setTokenLoading] = useState(false);
  const [tokenErrors, setTokenErrors] = useState<string[]>([]);
  const classes = useStyles();

  const addToken = async (): Promise<void> => {
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

  const removeToken = async (token: string): Promise<void> => {
    setTokenErrors([]);
    setTokenLoading(true);

    try {
      const response: ServerResponse = await Request.post({ url: '/account/remove-api-key', body: { token } });
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
          {
            icon: 'delete',
            tooltip: 'Delete',
            onClick: (e, rowData: any): Promise<void> => removeToken(rowData.token),
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
