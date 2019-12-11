import React from 'react';
import useForm from 'react-hook-form';
import * as yup from 'yup';

import Checkbox from '../../components/checkbox/checkbox';
import TextField from '../../components/text-field/text-field';

const TestSchema = yup.object().shape({
  TextField: yup.string().required('Required'),
});

const Demo: React.FC = () => {
  const { handleSubmit, register, setValue, reset, errors } = useForm({
    validationSchema: TestSchema,
  });

  const onSubmit = (data: any): void => console.log(data);

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Checkbox name="checkbox" errors={errors} register={register} setValue={setValue} />
      <TextField name="TextField" label="Text Field" errors={errors} register={register} setValue={setValue} required />

      <button type="submit">Submit</button>
    </form>
  );
};

export default Demo;
