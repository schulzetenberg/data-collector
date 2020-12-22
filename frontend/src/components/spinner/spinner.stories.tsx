import React from 'react';

// eslint-disable-next-line import/no-unresolved
import { Story, Meta } from '@storybook/react/types-6-0';

import Spinner, { SpinnerProps } from './spinner';

export default {
  title: 'Components/Shared/Spinner',
  component: Spinner,
} as Meta;

const Template: Story<SpinnerProps> = (args) => <Spinner {...args} />;

export const Basic = Template.bind({});
Basic.args = {};

export const PageLevel = Template.bind({});
PageLevel.args = {
  isPage: true,
};
