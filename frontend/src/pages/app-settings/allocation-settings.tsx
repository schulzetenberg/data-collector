import React, { useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useForm } from 'react-hook-form';

import { Button, Form, EditableTable } from '@schulzetenberg/component-library';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const useStyles = makeStyles(() => ({
  textCenter: {
    textAlign: 'center',
    '& div, & button': {
      maxWidth: 250,
    },
  },
}));

type List = {
  label: string;
  value: string;
  isStock: boolean;
  isETF: boolean;
  isOther: boolean;
  tableData?: { id: number };
};

type FormData = {
  list: List[];
};

const AllocationSettings: React.FC<{
  data: FormData;
  isLoading: boolean;
  submit: any;
}> = ({ data, isLoading, submit }) => {
  const classes = useStyles();
  // NOTE: Since we need to have the latest data to keep the table updated, have this (dangerous) state value.
  //	A better option would be to figure out how to update the table based on the react hook forms change event
  const [unsavedList, setUnsavedList] = useState<List[]>([]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    register,
    reset,
  } = useForm<FormData>();

  const formProps = { disabled: isLoading, control, errors, fullWidth: true };

  useEffect(() => {
    if (data) {
      const { list } = data;
      setUnsavedList(list);
      reset({ list });
    }
  }, [data, reset]);

  return (
    <Form disabled={formProps.disabled} onSubmit={handleSubmit(submit)}>
      <EditableTable
        tableState={unsavedList}
        setTableState={setUnsavedList}
        setValue={setValue}
        register={register}
        name="list"
        title="Assets"
        columns={[
          { title: 'Name/Stock Ticker', field: 'label' },
          // TODO: change checkobxes to 1 dropdown
          {
            title: 'Is Individual Stock',
            field: 'isStock',
            type: 'boolean',
            render: (x: any) => (x.isStock ? <CheckCircleOutlineIcon /> : ''),
          },
          {
            title: 'Is Mutual Fund or ETF',
            field: 'isETF',
            type: 'boolean',
            render: (x: any) => (x.isETF ? <CheckCircleOutlineIcon /> : ''),
          },
          // {
          //   title: 'Is Other Asset',
          //   field: 'isOther',
          //   type: 'boolean',
          //   render: (x: any) => (x.isOther ? <CheckCircleOutlineIcon /> : ''),
          // },
          { title: 'Total Value $', field: 'value', type: 'currency' },
        ]}
      />

      <div className={classes.textCenter}>
        <Button {...formProps} type="submit">
          Save
        </Button>
      </div>
    </Form>
  );
};

export default AllocationSettings;
