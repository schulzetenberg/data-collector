import React, { useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useForm } from 'react-hook-form';

import { Button, Form, TextField2, SwitchForm2, EditableTable } from '@schulzetenberg/component-library';

const useStyles = makeStyles(() => ({
  textCenter: { textAlign: 'center' },
}));

type Vehicle = {
  name: string;
  url: string;
  tableData?: { id: number };
};

type FormData = {
  active: boolean;
  schedule: string;
  vehicles: Vehicle[];
};

const FuellySettings: React.FC<{ data: FormData; isLoading: boolean; submit: any }> = ({ data, isLoading, submit }) => {
  const classes = useStyles();

  // NOTE: Since we need to have the latest data to keep the table updated, have this (dangerous) state value.
  //	A better option would be to figure out how to update the table based on the react hook forms change event
  const [unsavedVehicles, setUnsavedVehicles] = useState<Vehicle[]>([]);

  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const formProps = { disabled: isLoading, errors, control, fullWidth: true };

  useEffect(() => {
    if (data) {
      const { active, schedule, vehicles } = data;

      setUnsavedVehicles(vehicles);

      reset({
        active,
        schedule,
        vehicles,
      });
    }
  }, [data, reset]);

  return (
    <Form disabled={formProps.disabled} onSubmit={handleSubmit(submit)}>
      <div className={classes.textCenter}>
        <SwitchForm2 {...formProps} name="active" label="Active" />
      </div>
      <TextField2 {...formProps} name="schedule" label="Schedule" type="text" autoFocus />

      <EditableTable
        tableState={unsavedVehicles}
        setTableState={setUnsavedVehicles}
        setValue={setValue}
        register={register}
        name="vehicles"
        title="Vehicles"
        columns={[
          { title: 'Name', field: 'name' },
          { title: 'URL', field: 'url' },
        ]}
      />

      <Button {...formProps} type="submit">
        Save
      </Button>
    </Form>
  );
};

export default FuellySettings;
