import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Box, Divider, Tooltip,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import { useAuth } from '../../store/AuthContext';
import { NAV_ITEMS } from '../../utils/rolePermissions';
import { MIDNIGHT, TRUE_BLUE } from '../../theme/tokens';
import { alpha } from '@mui/material/styles';

const DRAWER_WIDTH = 240;

const ICONS: Record<string, React.ReactNode> = {
  Dashboard:         <DashboardIcon fontSize="small" />,
  RequestQuote:      <RequestQuoteIcon fontSize="small" />,
  AddCircleOutline:  <AddCircleOutlineIcon fontSize="small" />,
  FolderSpecial:     <FolderSpecialIcon fontSize="small" />,
  FolderOpen:        <FolderOpenIcon fontSize="small" />,
  Payment:           <PaymentIcon fontSize="small" />,
  Receipt:           <ReceiptIcon fontSize="small" />,
  EditNote:          <EditNoteIcon fontSize="small" />,
  AccountBalance:    <AccountBalanceIcon fontSize="small" />,
  VerifiedUser:      <VerifiedUserIcon fontSize="small" />,
  TrendingUp:        <TrendingUpIcon fontSize="small" />,
  BadgeOutlined:     <BadgeOutlinedIcon fontSize="small" />,
};

const GROUP_LABELS: Record<string, string> = {
  main:        '',
  sales:       'Sales',
  billing:     'Billing',
  operations:  'Operations',
  finance:     'Finance',
  producer:    'Producer',
};

// Sidebar text colors (on dark Midnight bg)
const SIDEBAR_TEXT    = '#CBD5E1';
const SIDEBAR_MUTED   = '#64748B';
const SIDEBAR_ACTIVE  = '#FFFFFF';
const SIDEBAR_BORDER  = 'rgba(255,255,255,0.07)';

export default function Sidebar({ open }: { open: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(user.role));
  const groups = Array.from(new Set(visibleItems.map(i => i.group)));

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: open ? DRAWER_WIDTH : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          mt: '56px',
          height: 'calc(100% - 56px)',
          overflowX: 'hidden',
          bgcolor: MIDNIGHT,
          borderRight: 'none',
          boxShadow: '2px 0 12px rgba(14,16,32,0.15)',
        },
      }}
    >
      <Box sx={{ pt: 1.5, pb: 2 }}>
        {groups.map((group, gi) => {
          const items = visibleItems.filter(i => i.group === group);
          return (
            <Box key={group}>
              {gi > 0 && <Divider sx={{ my: 1.5, borderColor: SIDEBAR_BORDER, mx: 2 }} />}
              {GROUP_LABELS[group] && (
                <Typography
                  variant="caption"
                  sx={{
                    px: 2.5, py: 0.5, display: 'block',
                    color: SIDEBAR_MUTED,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 700,
                    fontSize: '0.6rem',
                  }}
                >
                  {GROUP_LABELS[group]}
                </Typography>
              )}
              <List dense disablePadding>
                {items.map(item => {
                  const isActive = location.pathname === item.path ||
                    (item.path !== '/' && location.pathname.startsWith(item.path));
                  return (
                    <ListItem key={item.path} disablePadding sx={{ px: 1 }}>
                      <Tooltip title="" placement="right">
                        <ListItemButton
                          selected={isActive}
                          onClick={() => navigate(item.path)}
                          sx={{
                            borderRadius: 1.5,
                            py: 0.8,
                            color: isActive ? SIDEBAR_ACTIVE : SIDEBAR_TEXT,
                            bgcolor: isActive ? alpha(TRUE_BLUE, 0.18) : 'transparent',
                            borderLeft: isActive ? `3px solid ${TRUE_BLUE}` : '3px solid transparent',
                            pl: isActive ? 1.25 : 1.5,
                            '&:hover': {
                              bgcolor: alpha('#fff', 0.06),
                              color: SIDEBAR_ACTIVE,
                            },
                            '&.Mui-selected': {
                              bgcolor: alpha(TRUE_BLUE, 0.18),
                              '&:hover': { bgcolor: alpha(TRUE_BLUE, 0.22) },
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 32, color: isActive ? TRUE_BLUE : SIDEBAR_MUTED }}>
                            {ICONS[item.icon]}
                          </ListItemIcon>
                          <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{
                              fontSize: '0.82rem',
                              fontWeight: isActive ? 600 : 400,
                              color: 'inherit',
                            }}
                          />
                        </ListItemButton>
                      </Tooltip>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          );
        })}
      </Box>

      {/* Bottom: ServiceNow status */}
      <Box sx={{ mt: 'auto', p: 2, borderTop: `1px solid ${SIDEBAR_BORDER}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#4ADE80', boxShadow: '0 0 6px #4ADE80' }} />
          <Typography sx={{ fontSize: '0.72rem', color: SIDEBAR_TEXT, fontWeight: 500 }}>
            ServiceNow Connected
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '0.65rem', color: SIDEBAR_MUTED, mt: 0.25 }}>
          PRENEED_DEMO instance
        </Typography>
      </Box>
    </Drawer>
  );
}

export { DRAWER_WIDTH };
