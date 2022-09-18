import { Theme } from '@mui/material/styles';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line no-unused-vars
  interface DefaultTheme extends Theme {}
}
