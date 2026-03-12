import { ThemeProvider, CssBaseline } from '@mui/material';
import { dxcTheme } from './theme/dxcTheme';
import AppRouter from './router/AppRouter';

export default function App() {
  return (
    <ThemeProvider theme={dxcTheme}>
      <CssBaseline />
      <AppRouter />
    </ThemeProvider>
  );
}
