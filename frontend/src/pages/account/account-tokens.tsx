import React, { useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import MaterialTable from 'material-table';

import { ErrorList, Request } from '@schulzetenberg/component-library';
import { CatchResponse, ServerResponse } from '../../types/response';
import { Token } from '../../types/account';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: theme.spacing(4),
  },
}));

const AccountTokens: React.FC<{
  tokens?: Token[];
  updateTokens: (tokens: Token[]) => void;
  isLoading: boolean;
}> = ({ tokens = [], updateTokens, isLoading }) => {
  const [isTokenLoading, setTokenLoading] = useState(false);
  const [tokenErrors, setTokenErrors] = useState<string[]>([]);
  const classes = useStyles();

  const addToken = async (): Promise<void> => {
    setTokenErrors([]);
    setTokenLoading(true);

    try {
      const { data: response }: ServerResponse = await Request.get({ url: '/account/api-key' });
      if (response.errors) {
        setTokenErrors(response.errors);
      } else {
        updateTokens(response.data);
      }
    } catch (e) {
      setTokenErrors(e as CatchResponse);
    } finally {
      setTokenLoading(false);
    }
  };

  const removeToken = async (token: string): Promise<void> => {
    setTokenErrors([]);
    setTokenLoading(true);

    try {
      const { data: response }: ServerResponse = await Request.post({
        url: '/account/remove-api-key',
        body: { token },
      });
      if (response.errors) {
        setTokenErrors(response.errors);
      } else {
        updateTokens(response.data);
      }
    } catch (e) {
      setTokenErrors(e as CatchResponse);
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
