import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: { main: '#1565c0' },
    secondary: { main: '#424242' },
    background: { default: '#fafafa' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default theme;
