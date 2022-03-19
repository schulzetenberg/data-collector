import React, { useEffect, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';
import MaterialTable from 'material-table';

import { Button, Form } from '@schulzetenberg/component-library';

const useStyles = makeStyles((theme: Theme) => ({
  textCenter: { textAlign: 'center' },
}));

type List = {
  name: string;
  value: string;
	isStock: boolean;
  tableData?: { id: number };
};

type FormData = {
  list: List[];
};

const AllocationSettings: React.FC<{
	data: FormData;
	isLoading: boolean;
	submit: any
}> = ({ data, isLoading, submit }) => {
  const classes = useStyles();

  // NOTE: Since we need to have the latest data to keep the table updated, have this (dangerous) state value.
  //	A better option would be to figure out how to update the table based on the react hook forms change event
  const [unsavedList, setUnsavedList] = useState<List[]>([]);

  const { handleSubmit, register, setValue, errors, reset } = useForm<FormData>();

  const formProps = { disabled: isLoading, errors, register, setValue, fullWidth: true };

  useEffect(() => {
    if (data) {
      const { list } = data;
      setUnsavedList(list);
      reset({ list });
    }
  }, [data, reset]);

  return (
    <>
      <Form disabled={formProps.disabled} onSubmit={handleSubmit(submit)}>
        <MaterialTable
          options={{ search: false }}
          editable={{
            onRowAdd: (newData): Promise<void> =>
              new Promise((resolve) => {
                const newList = [...unsavedList, newData];
                setValue('list', newList);
                setUnsavedList(newList);
                resolve();
              }),
            onRowUpdate: (newData: any, oldData: any): Promise<void> =>
              new Promise((resolve) => {
                const changedItemIndex = unsavedList.findIndex((x) => x.tableData?.id === oldData.tableData?.id);

                const newList = [...unsavedList];
                newList[changedItemIndex].name = newData.name;
                newList[changedItemIndex].isStock = newData.isStock;
                newList[changedItemIndex].value = newData.value;

                setValue('list', newList);
                setUnsavedList(newList);
                resolve();
              }),
            onRowDelete: (oldData: any): Promise<void> =>
              new Promise((resolve) => {
                const changedItemIndex = unsavedList.findIndex((x) => x.tableData?.id === oldData.tableData?.id);

                const newList = [...unsavedList];
                newList.splice(changedItemIndex, 1);

                setValue('list', newList);
                setUnsavedList(newList);
                resolve();
              }),
          }}
          columns={[
            { title: 'Name/Stock Ticker', field: 'name' },
            { title: 'Is Stock/ETF', field: 'isStock', type: 'boolean', render: rowData => (rowData.isStock ? "True" : "False"), },
            { title: '$ Value', field: 'value', type: 'currency' },
          ]}
          data={unsavedList}
          title="Assets"
        />

        <Button {...formProps} type="submit">
          Save
        </Button>
      </Form>
    </>
  );
};

export default AllocationSettings;
