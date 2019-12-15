import { useState } from 'react';

const FormOld = (
  initialValues: any,
  callback: { (inputs: any): any }
): {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputs: any;
} => {
  const [inputs, setInputs] = useState(initialValues);

  const handleSubmit = (e: React.FormEvent<EventTarget>): void => {
    if (e) e.preventDefault();
    callback(inputs);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    e.persist(); // TODO: Do I need this?
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.persist(); // TODO: Do I need this?
    setInputs({ ...inputs, [e.target.name]: e.target.checked });
  };

  return {
    handleSubmit,
    handleInputChange,
    handleCheckboxChange,
    inputs,
  };
};

export default FormOld;
