import { createTheme, alpha } from '@mui/material/styles';
import {
  NAVY, NAVY_LIGHT, NAVY_DARK, NAVY_SURFACE,
  CYAN, CYAN_DARK,
  BORDER, BORDER_LIGHT,
  TEXT_PRIMARY, TEXT_SECONDARY,
  SUCCESS, WARNING, ERROR,
} from './tokens';

export const dxcTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: NAVY_LIGHT,
      light: NAVY_SURFACE,
      dark: NAVY_DARK,
      contrastText: TEXT_PRIMARY,
    },
    secondary: {
      main: CYAN,
      dark: CYAN_DARK,
      contrastText: NAVY_DARK,
    },
    background: {
      default: NAVY,
      paper: NAVY_LIGHT,
    },
    text: {
      primary: TEXT_PRIMARY,
      secondary: TEXT_SECONDARY,
    },
    divider: BORDER,
    success: { main: SUCCESS },
    warning: { main: WARNING },
    error: { main: ERROR },
    info: { main: CYAN },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.5px' },
    h5: { fontWeight: 700, letterSpacing: '-0.3px' },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600, color: TEXT_PRIMARY },
    subtitle2: { fontWeight: 600, color: TEXT_SECONDARY },
    body2: { color: TEXT_SECONDARY },
    caption: { color: TEXT_SECONDARY },
    overline: { color: TEXT_SECONDARY, fontWeight: 600, letterSpacing: '1px' },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: NAVY,
          scrollbarWidth: 'thin',
          scrollbarColor: `${BORDER_LIGHT} ${NAVY_DARK}`,
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': { background: NAVY_DARK },
          '&::-webkit-scrollbar-thumb': { background: BORDER_LIGHT, borderRadius: 3 },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
        containedSecondary: {
          backgroundColor: CYAN,
          color: NAVY_DARK,
          '&:hover': { backgroundColor: CYAN_DARK },
        },
        outlinedSecondary: {
          borderColor: CYAN,
          color: CYAN,
          '&:hover': { backgroundColor: alpha(CYAN, 0.08), borderColor: CYAN },
        },
        containedPrimary: {
          backgroundColor: NAVY_SURFACE,
          color: TEXT_PRIMARY,
          border: `1px solid ${BORDER_LIGHT}`,
          '&:hover': { backgroundColor: BORDER, borderColor: CYAN },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: NAVY_LIGHT,
          border: `1px solid ${BORDER}`,
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: NAVY_LIGHT,
          border: `1px solid ${BORDER}`,
        },
        elevation0: { border: 'none' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: NAVY_DARK,
          borderBottom: `1px solid ${BORDER}`,
          backgroundImage: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: NAVY_DARK,
          borderRight: `1px solid ${BORDER}`,
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: BORDER_LIGHT },
            '&:hover fieldset': { borderColor: CYAN },
            '&.Mui-focused fieldset': { borderColor: CYAN },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: CYAN },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': { borderColor: BORDER_LIGHT },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: CYAN },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: CYAN },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: alpha(CYAN, 0.08) },
          '&.Mui-selected': { backgroundColor: alpha(CYAN, 0.15) },
          '&.Mui-selected:hover': { backgroundColor: alpha(CYAN, 0.2) },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: { '& .MuiTableCell-root': { backgroundColor: NAVY_DARK, fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: TEXT_SECONDARY } },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: { '&:hover': { backgroundColor: alpha(CYAN, 0.04) }, cursor: 'pointer' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: BORDER, padding: '10px 16px' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: '0.7rem' },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: BORDER },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          margin: '1px 8px',
          '&.Mui-selected': {
            backgroundColor: alpha(CYAN, 0.12),
            color: CYAN,
            '& .MuiListItemIcon-root': { color: CYAN },
            '&:hover': { backgroundColor: alpha(CYAN, 0.16) },
          },
          '&:hover': { backgroundColor: alpha(CYAN, 0.06) },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: { minWidth: 36, color: TEXT_SECONDARY },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: { backgroundColor: 'transparent' },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: { '&.Mui-active': { color: CYAN, fontWeight: 600 }, '&.Mui-completed': { color: SUCCESS } },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: { '&.Mui-active': { color: CYAN }, '&.Mui-completed': { color: SUCCESS } },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          '&.Mui-selected': { color: CYAN },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: CYAN },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { backgroundColor: NAVY_DARK, border: `1px solid ${BORDER_LIGHT}`, fontSize: '0.75rem' },
      },
    },
  },
});
