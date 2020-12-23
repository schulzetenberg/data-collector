import React, { ReactElement } from 'react';

// eslint-disable-next-line import/no-unresolved
import { Story, Meta } from '@storybook/react/types-6-0';
import { Grid } from '@material-ui/core';

import Header from './header';

export default {
  title: 'Components/Shared/Header',
  component: Header,
  decorators: [
    (StoryComponent): ReactElement => (
      <Grid item xs={12}>
        <StoryComponent />
      </Grid>
    ),
  ],
} as Meta;

const Template: Story<{}> = (args) => <Header {...args} />;

export const Basic = Template.bind({});
Basic.args = {};

export const LoggedIn = Template.bind({});
LoggedIn.args = {
	forceLoggedIn: true
};
