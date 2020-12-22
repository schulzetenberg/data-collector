import React from 'react';

// eslint-disable-next-line import/no-unresolved
import { Story, Meta } from '@storybook/react/types-6-0';

import Button from './button';

export default {
  title: 'Components/Shared/Button',
  component: Button,
} as Meta;

const Template: Story = (args) => <Button {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: 'Button',
};

export const Default = Template.bind({});
Default.args = {
  ...Basic.args,
  color: 'default',
};

export const Secondary = Template.bind({});
Secondary.args = {
  ...Basic.args,
  color: 'secondary',
};

export const Submit = Template.bind({});
Submit.args = {
  ...Basic.args,
  type: 'submit',
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Basic.args,
  disabled: true,
};

export const Loading = Template.bind({});
Loading.args = {
  ...Basic.args,
  loading: true,
};
