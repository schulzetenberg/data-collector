import red from '@mui/material/colors/red';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  transitions: {
    duration: {
      shortest: 150,
    },
  },
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
});

export default theme;
