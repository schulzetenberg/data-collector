import React, { useEffect, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';

import { Button, Form, EditableTable } from '@schulzetenberg/component-library';

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

  const { handleSubmit, control, formState: { errors }, setValue, register, reset } = useForm<FormData>();

  const formProps = { disabled: isLoading, control, errors, fullWidth: true };

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
				<EditableTable
					tableState={unsavedList}
					setTableState={setUnsavedList}
					setValue={setValue}
					register={register}
					name="list"
					title="Assets"
					columns={[
						{ title: 'Name/Stock Ticker', field: 'name' },
						{
							title: 'Is Stock/ETF', field: 'isStock', type: 'boolean',
							render: (x: any) => (x.isStock ? 'True' : 'False'),
						},
						{ title: '$ Value', field: 'value', type: 'currency' },
					]}
				/>
        <Button {...formProps} type="submit">
          Save
        </Button>
      </Form>
    </>
  );
};

export default AllocationSettings;
