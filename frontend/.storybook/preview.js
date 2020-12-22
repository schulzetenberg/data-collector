import React from 'react';
import { addDecorator } from '@storybook/react';
import { ThemeProvider } from '@material-ui/core/styles';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import StoryRouter from 'storybook-react-router';

import theme from '../src/theme';

addDecorator(StoryRouter());

addDecorator((story) => <ThemeProvider theme={theme}>{story()}</ThemeProvider>);

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
  // previewTabs: {
  // 	'storybook/docs/panel': {
  // 		hidden: true,
  // 	},
  // },
};
