import React from 'react';

// eslint-disable-next-line import/no-unresolved
import { Story, Meta } from '@storybook/react/types-6-0';

import Checkbox, { CheckboxProps } from './checkbox';

export default {
  title: 'Components/Shared/Checkbox',
  component: Checkbox,
  argTypes: {
    setValue: { action: 'set value' },
  },
} as Meta;

const Template: Story<CheckboxProps> = (args) => <Checkbox {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  name: 'Basic',
  label: 'Label',
  register: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  errors: {},
  // [x: string]: any;
};

export const Secondary = Template.bind({});
Secondary.args = {
  ...Basic.args,
  color: 'secondary',
};

export const Default = Template.bind({});
Default.args = {
  ...Basic.args,
  color: 'default',
};