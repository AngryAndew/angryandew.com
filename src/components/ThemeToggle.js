import React from 'react';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

function ThemeToggle({ mode, onToggle }) {
  const isLight = mode === 'light';

  return (
    <IconButton
      onClick={onToggle}
      aria-label={isLight ? 'toggle dark mode' : 'toggle light mode'}
      color="inherit"
    >
      {isLight ? <Brightness4Icon /> : <Brightness7Icon />}
    </IconButton>
  );
}

export default ThemeToggle;
