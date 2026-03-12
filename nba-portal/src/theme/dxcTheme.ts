import { createTheme, alpha } from '@mui/material/styles';
import {
  MIDNIGHT, MIDNIGHT_DARK,
  ROYAL, ROYAL_LIGHT, ROYAL_DARK,
  TRUE_BLUE, TRUE_BLUE_DARK, TRUE_BLUE_LIGHT,
  GOLD, MELON, SKY, SUCCESS,
  BG_PAGE, BG_CARD,
  BORDER, BORDER_LIGHT,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
} from './tokens';

export const dxcTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: ROYAL,
      light: ROYAL_LIGHT,
      dark: ROYAL_DARK,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: TRUE_BLUE,
      dark: TRUE_BLUE_DARK,
      light: TRUE_BLUE_LIGHT,
      contrastText: '#FFFFFF',
    },
    background: {
      default: BG_PAGE,
      paper: BG_CARD,
    },
    text: {
      primary: TEXT_PRIMARY,
      secondary: TEXT_SECONDARY,
      disabled: TEXT_MUTED,
    },
    divider: BORDER,
    success: { main: SUCCESS, contrastText: '#fff' },
    warning: { main: '#D97706', contrastText: '#fff' },
    error:   { main: '#DC2626', contrastText: '#fff' },
    info:    { main: ROYAL,     contrastText: '#fff' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.5px', color: TEXT_PRIMARY },
    h5: { fontWeight: 700, letterSpacing: '-0.3px', color: TEXT_PRIMARY },
    h6: { fontWeight: 600, color: TEXT_PRIMARY },
    subtitle1: { fontWeight: 600, color: TEXT_PRIMARY },
    subtitle2: { fontWeight: 600, color: TEXT_SECONDARY },
    body1: { color: TEXT_PRIMARY },
    body2: { color: TEXT_SECONDARY },
    caption: { color: TEXT_SECONDARY },
    overline: { color: TEXT_MUTED, fontWeight: 700, letterSpacing: '1px', fontSize: '0.68rem' },
  },
  shape: { borderRadius: 10 },
  shadows: [
    'none',
    '0 1px 3px rgba(14,16,32,0.06), 0 1px 2px rgba(14,16,32,0.04)',
    '0 2px 6px rgba(14,16,32,0.07), 0 1px 3px rgba(14,16,32,0.04)',
    '0 4px 12px rgba(14,16,32,0.08), 0 2px 4px rgba(14,16,32,0.04)',
    '0 6px 16px rgba(14,16,32,0.09), 0 2px 6px rgba(14,16,32,0.05)',
    '0 8px 24px rgba(14,16,32,0.10), 0 4px 8px rgba(14,16,32,0.05)',
    '0 12px 32px rgba(14,16,32,0.11)', '0 16px 40px rgba(14,16,32,0.12)',
    '0 20px 48px rgba(14,16,32,0.12)', '0 24px 56px rgba(14,16,32,0.13)',
    '0 28px 64px rgba(14,16,32,0.13)', '0 32px 72px rgba(14,16,32,0.14)',
    '0 36px 80px rgba(14,16,32,0.14)', '0 40px 88px rgba(14,16,32,0.14)',
    '0 44px 96px rgba(14,16,32,0.15)', '0 48px 104px rgba(14,16,32,0.15)',
    '0 52px 112px rgba(14,16,32,0.15)', '0 56px 120px rgba(14,16,32,0.16)',
    '0 60px 128px rgba(14,16,32,0.16)', '0 64px 136px rgba(14,16,32,0.16)',
    '0 68px 144px rgba(14,16,32,0.17)', '0 72px 152px rgba(14,16,32,0.17)',
    '0 76px 160px rgba(14,16,32,0.17)', '0 80px 168px rgba(14,16,32,0.18)',
    '0 84px 176px rgba(14,16,32,0.18)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: BG_PAGE,
          scrollbarWidth: 'thin',
          scrollbarColor: `${BORDER} ${BORDER_LIGHT}`,
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': { background: BORDER_LIGHT },
          '&::-webkit-scrollbar-thumb': { background: BORDER, borderRadius: 3 },
        },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em', borderRadius: 8 },
        containedPrimary: {
          backgroundColor: ROYAL,
          color: '#fff',
          '&:hover': { backgroundColor: ROYAL_DARK },
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${TRUE_BLUE} 0%, ${ROYAL_LIGHT} 100%)`,
          color: '#fff',
          '&:hover': { background: `linear-gradient(135deg, ${TRUE_BLUE_DARK} 0%, ${ROYAL} 100%)` },
        },
        outlinedPrimary: {
          borderColor: BORDER,
          color: TEXT_SECONDARY,
          '&:hover': { borderColor: ROYAL, color: ROYAL, backgroundColor: alpha(ROYAL, 0.04) },
        },
        outlinedSecondary: {
          borderColor: TRUE_BLUE,
          color: TRUE_BLUE,
          '&:hover': { backgroundColor: alpha(TRUE_BLUE, 0.06) },
        },
        text: { color: TEXT_SECONDARY, '&:hover': { color: TEXT_PRIMARY, backgroundColor: alpha(MIDNIGHT, 0.04) } },
      },
    },

    MuiCard: {
      defaultProps: { elevation: 1 },
      styleOverrides: {
        root: {
          backgroundColor: BG_CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 12,
          backgroundImage: 'none',
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none', backgroundColor: BG_CARD },
        elevation0: { border: `1px solid ${BORDER}` },
        elevation1: { border: `1px solid ${BORDER}` },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: BG_CARD,
          borderBottom: `1px solid ${BORDER}`,
          backgroundImage: 'none',
          color: TEXT_PRIMARY,
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          // Sidebar stays Midnight Blue — dark/light split
          backgroundColor: MIDNIGHT,
          borderRight: 'none',
          backgroundImage: 'none',
        },
      },
    },

    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: BG_CARD,
            '& fieldset': { borderColor: BORDER },
            '&:hover fieldset': { borderColor: TRUE_BLUE },
            '&.Mui-focused fieldset': { borderColor: ROYAL, borderWidth: 2 },
          },
          '& .MuiInputLabel-root': { color: TEXT_SECONDARY },
          '& .MuiInputLabel-root.Mui-focused': { color: ROYAL },
          '& .MuiInputBase-input': { color: TEXT_PRIMARY },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: BG_CARD,
          color: TEXT_PRIMARY,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: BORDER },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: TRUE_BLUE },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: ROYAL, borderWidth: 2 },
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: TEXT_PRIMARY,
          '&:hover': { backgroundColor: alpha(ROYAL, 0.05) },
          '&.Mui-selected': { backgroundColor: alpha(ROYAL, 0.08), color: ROYAL, fontWeight: 600 },
          '&.Mui-selected:hover': { backgroundColor: alpha(ROYAL, 0.12) },
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            backgroundColor: BG_PAGE,
            fontWeight: 700,
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            color: TEXT_MUTED,
            borderBottom: `2px solid ${BORDER}`,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: alpha(ROYAL, 0.03) },
          cursor: 'pointer',
          '&:last-child td': { borderBottom: 0 },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: BORDER_LIGHT, padding: '10px 16px', color: TEXT_PRIMARY },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: '0.72rem', borderRadius: 6 },
        colorPrimary: { backgroundColor: alpha(ROYAL, 0.1), color: ROYAL },
        colorSecondary: { backgroundColor: alpha(TRUE_BLUE, 0.1), color: TRUE_BLUE },
      },
    },

    MuiDivider: {
      styleOverrides: { root: { borderColor: BORDER } },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '1px 8px',
          color: '#94A3B8',  // muted on dark sidebar
          '&.Mui-selected': {
            backgroundColor: alpha('#FFFFFF', 0.1),
            color: '#FFFFFF',
            '& .MuiListItemIcon-root': { color: TRUE_BLUE },
            '&:hover': { backgroundColor: alpha('#FFFFFF', 0.14) },
          },
          '&:hover': { backgroundColor: alpha('#FFFFFF', 0.06), color: '#FFFFFF' },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: { root: { minWidth: 36, color: '#94A3B8' } },
    },
    MuiListItemText: {
      styleOverrides: { primary: { color: 'inherit' } },
    },

    MuiStepper: {
      styleOverrides: { root: { backgroundColor: 'transparent' } },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          '&.Mui-active': { color: ROYAL, fontWeight: 600 },
          '&.Mui-completed': { color: SUCCESS },
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          color: BORDER,
          '&.Mui-active': { color: ROYAL },
          '&.Mui-completed': { color: SUCCESS },
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          color: TEXT_SECONDARY,
          '&.Mui-selected': { color: ROYAL },
        },
      },
    },
    MuiTabs: {
      styleOverrides: { indicator: { backgroundColor: ROYAL, height: 3, borderRadius: 2 } },
    },

    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10, border: '1px solid transparent' },
        standardSuccess: { backgroundColor: '#F0FDF4', color: '#15803D', borderColor: '#BBF7D0' },
        standardWarning: { backgroundColor: '#FFFBEB', color: '#B45309', borderColor: '#FDE68A' },
        standardError:   { backgroundColor: '#FEF2F2', color: '#B91C1C', borderColor: '#FECACA' },
        standardInfo:    { backgroundColor: '#EBF3FF', color: ROYAL,     borderColor: '#BFDBFE' },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: MIDNIGHT_DARK,
          color: '#fff',
          fontSize: '0.75rem',
          borderRadius: 6,
          padding: '6px 10px',
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: { backgroundColor: alpha(ROYAL, 0.12), borderRadius: 4, height: 6 },
        bar: { backgroundColor: ROYAL, borderRadius: 4 },
      },
    },

    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: BG_CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: '10px !important',
          '&:before': { display: 'none' },
          boxShadow: 'none',
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        root: { color: TEXT_PRIMARY },
        input: { '&::placeholder': { color: TEXT_MUTED, opacity: 1 } },
      },
    },
  },
});
