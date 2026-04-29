import { createTheme } from '@mui/material';

const lightPalette = {
  mode: 'light',
  background: { default: '#f5f5f5', paper: '#ffffff' },
  primary: { main: '#1565c0' },
  secondary: { main: '#00897b' },
  text: { primary: '#212121', secondary: '#616161' },
  divider: '#e0e0e0',
};

const darkPalette = {
  mode: 'dark',
  background: { default: '#121212', paper: '#1e1e1e' },
  primary: { main: '#90caf9' },
  secondary: { main: '#4db6ac' },
  text: { primary: '#e0e0e0', secondary: '#b0b0b0' },
  divider: '#333333',
};

const typography = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  h1: { fontWeight: 700 },
  h2: { fontWeight: 700 },
  h3: { fontWeight: 600 },
  h4: { fontWeight: 600 },
  h5: { fontWeight: 500 },
  h6: { fontWeight: 500 },
};

const transition = 'background-color 300ms ease, color 300ms ease';

export function getTheme(mode) {
  return createTheme({
    palette: mode === 'dark' ? darkPalette : lightPalette,
    typography,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            transition,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            transition,
          },
        },
      },
    },
  });
}

export default getTheme;
