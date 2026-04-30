import React, { useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getTheme } from './theme';
import { useColorMode } from './useColorMode';
import LandingPage from './components/LandingPage';

function App() {
  const { mode, toggleColorMode } = useColorMode();
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LandingPage mode={mode} onToggleColorMode={toggleColorMode} />
    </ThemeProvider>
  );
}

export default App;
