import React, { ReactElement } from 'react';

// eslint-disable-next-line import/no-unresolved
import { Story, Meta } from '@storybook/react/types-6-0';
import { Grid } from '@material-ui/core';

import Modal, { ModalProps } from './modal';

export default {
  title: 'Components/Shared/Modal',
  component: Modal,
  decorators: [
    (StoryComponent): ReactElement => (
      <Grid item xs={12} sm={6}>
        <StoryComponent />
      </Grid>
    ),
  ],
  argTypes: {
    handleClose: { action: 'close' },
  },
} as Meta;

const Template: Story<ModalProps> = (args) => <Modal {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  open: true,
  title: 'Modal Title',
  children: <>Modal Content</>,
};
