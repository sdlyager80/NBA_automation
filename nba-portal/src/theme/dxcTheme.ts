import { createTheme, alpha } from '@mui/material/styles';
import {
  MIDNIGHT, MIDNIGHT_LIGHT, MIDNIGHT_DARK, MIDNIGHT_SURFACE,
  ROYAL, ROYAL_LIGHT, ROYAL_DARK,
  TRUE_BLUE, TRUE_BLUE_DARK,
  GOLD, MELON, SKY, SUCCESS,
  BORDER, BORDER_LIGHT,
  TEXT_PRIMARY, TEXT_SECONDARY,
} from './tokens';

export const dxcTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: ROYAL,
      light: ROYAL_LIGHT,
      dark: ROYAL_DARK,
      contrastText: TEXT_PRIMARY,
    },
    secondary: {
      main: TRUE_BLUE,
      dark: TRUE_BLUE_DARK,
      contrastText: '#FFFFFF',
    },
    background: {
      default: MIDNIGHT,
      paper: MIDNIGHT_LIGHT,
    },
    text: {
      primary: TEXT_PRIMARY,
      secondary: TEXT_SECONDARY,
    },
    divider: BORDER,
    success: { main: SUCCESS },
    warning: { main: GOLD },
    error: { main: MELON },
    info: { main: SKY },
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
          backgroundColor: MIDNIGHT,
          scrollbarWidth: 'thin',
          scrollbarColor: `${BORDER_LIGHT} ${MIDNIGHT_DARK}`,
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': { background: MIDNIGHT_DARK },
          '&::-webkit-scrollbar-thumb': { background: BORDER_LIGHT, borderRadius: 3 },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
        containedSecondary: {
          background: `linear-gradient(135deg, ${TRUE_BLUE} 0%, ${ROYAL_LIGHT} 100%)`,
          color: '#FFFFFF',
          '&:hover': { background: `linear-gradient(135deg, ${TRUE_BLUE_DARK} 0%, ${ROYAL} 100%)` },
        },
        containedPrimary: {
          backgroundColor: ROYAL,
          color: TEXT_PRIMARY,
          border: `1px solid ${ROYAL_LIGHT}`,
          '&:hover': { backgroundColor: ROYAL_LIGHT },
        },
        outlinedSecondary: {
          borderColor: TRUE_BLUE,
          color: TRUE_BLUE,
          '&:hover': { backgroundColor: alpha(TRUE_BLUE, 0.08), borderColor: TRUE_BLUE },
        },
        outlinedPrimary: {
          borderColor: BORDER_LIGHT,
          color: TEXT_SECONDARY,
          '&:hover': { borderColor: TRUE_BLUE, color: TRUE_BLUE, backgroundColor: alpha(TRUE_BLUE, 0.06) },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: MIDNIGHT_LIGHT,
          border: `1px solid ${BORDER}`,
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: MIDNIGHT_LIGHT,
          border: `1px solid ${BORDER}`,
        },
        elevation0: { border: 'none' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: MIDNIGHT_DARK,
          borderBottom: `1px solid ${BORDER}`,
          backgroundImage: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: MIDNIGHT_DARK,
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
            '&:hover fieldset': { borderColor: TRUE_BLUE },
            '&.Mui-focused fieldset': { borderColor: TRUE_BLUE },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: TRUE_BLUE },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': { borderColor: BORDER_LIGHT },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: TRUE_BLUE },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: TRUE_BLUE },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: alpha(TRUE_BLUE, 0.08) },
          '&.Mui-selected': { backgroundColor: alpha(TRUE_BLUE, 0.15) },
          '&.Mui-selected:hover': { backgroundColor: alpha(TRUE_BLUE, 0.2) },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            backgroundColor: MIDNIGHT_DARK,
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: TEXT_SECONDARY,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: { '&:hover': { backgroundColor: alpha(TRUE_BLUE, 0.04) }, cursor: 'pointer' },
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
            backgroundColor: alpha(TRUE_BLUE, 0.15),
            color: TRUE_BLUE,
            '& .MuiListItemIcon-root': { color: TRUE_BLUE },
            '&:hover': { backgroundColor: alpha(TRUE_BLUE, 0.2) },
          },
          '&:hover': { backgroundColor: alpha(TRUE_BLUE, 0.07) },
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
        label: {
          '&.Mui-active': { color: TRUE_BLUE, fontWeight: 600 },
          '&.Mui-completed': { color: SUCCESS },
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          '&.Mui-active': { color: TRUE_BLUE },
          '&.Mui-completed': { color: SUCCESS },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          '&.Mui-selected': { color: TRUE_BLUE },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: TRUE_BLUE },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { backgroundColor: MIDNIGHT_DARK, border: `1px solid ${BORDER_LIGHT}`, fontSize: '0.75rem' },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { backgroundColor: alpha(TRUE_BLUE, 0.15) },
        bar: { backgroundColor: TRUE_BLUE },
      },
    },
  },
});
