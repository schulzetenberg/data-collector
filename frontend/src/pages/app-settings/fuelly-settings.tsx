import React, { useEffect, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';
import MaterialTable from 'material-table';

import { Button, Form, TextField, SwitchForm } from '@schulzetenberg/component-library';

const useStyles = makeStyles((theme: Theme) => ({
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

  const { handleSubmit, register, setValue, errors, reset } = useForm<FormData>();

  const formProps = { disabled: isLoading, errors, register, setValue, fullWidth: true };

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
    <>
      <Form disabled={formProps.disabled} onSubmit={handleSubmit(submit)}>
        <div className={classes.textCenter}>
          <SwitchForm {...formProps} name="active" label="Active" />
        </div>
        <TextField {...formProps} name="schedule" label="Schedule" type="text" autoFocus />

        <MaterialTable
          options={{
            search: false,
          }}
          editable={{
            onRowAdd: (newData): Promise<void> =>
              new Promise((resolve) => {
                const newVehicleList = [...unsavedVehicles, newData];
                setValue('vehicles', newVehicleList);
                setUnsavedVehicles(newVehicleList);
                resolve();
              }),
            onRowUpdate: (newData: any, oldData: any): Promise<void> =>
              new Promise((resolve) => {
                const changedVehicleIndex = unsavedVehicles.findIndex((x) => x.tableData?.id === oldData.tableData?.id);

                const newVehicleList = [...unsavedVehicles];
                newVehicleList[changedVehicleIndex].name = newData.name;
                newVehicleList[changedVehicleIndex].url = newData.url;

                setValue('vehicles', newVehicleList);
                setUnsavedVehicles(newVehicleList);
                resolve();
              }),
            onRowDelete: (oldData: any): Promise<void> =>
              new Promise((resolve) => {
                const changedVehicleIndex = unsavedVehicles.findIndex((x) => x.tableData?.id === oldData.tableData?.id);

                const newVehicleList = [...unsavedVehicles];
                newVehicleList.splice(changedVehicleIndex, 1);

                setValue('vehicles', newVehicleList);
                setUnsavedVehicles(newVehicleList);
                resolve();
              }),
          }}
          columns={[
            { title: 'Name', field: 'name' },
            { title: 'URL', field: 'url' },
          ]}
          data={unsavedVehicles}
          title="Vehicles"
        />

        <Button {...formProps} type="submit">
          Save
        </Button>
      </Form>
    </>
  );
};

export default FuellySettings;
