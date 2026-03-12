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
import { NAVY_DARK, CYAN, BORDER, TEXT_SECONDARY } from '../../theme/tokens';

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

export default function Sidebar({ open }: { open: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(user.role));

  // Group items
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
        },
      }}
    >
      <Box sx={{ pt: 1, pb: 2 }}>
        {groups.map((group, gi) => {
          const items = visibleItems.filter(i => i.group === group);
          return (
            <Box key={group}>
              {gi > 0 && <Divider sx={{ my: 1, borderColor: BORDER }} />}
              {GROUP_LABELS[group] && (
                <Typography
                  variant="caption"
                  sx={{ px: 2.5, py: 0.5, display: 'block', color: TEXT_SECONDARY, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, fontSize: '0.62rem' }}
                >
                  {GROUP_LABELS[group]}
                </Typography>
              )}
              <List dense disablePadding>
                {items.map(item => {
                  const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                  return (
                    <ListItem key={item.path} disablePadding sx={{ px: 1 }}>
                      <Tooltip title="" placement="right">
                        <ListItemButton
                          selected={isActive}
                          onClick={() => navigate(item.path)}
                          sx={{ borderRadius: 1.5, py: 0.75 }}
                        >
                          <ListItemIcon sx={{ minWidth: 32, color: isActive ? CYAN : TEXT_SECONDARY }}>
                            {ICONS[item.icon]}
                          </ListItemIcon>
                          <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: isActive ? 600 : 400 }}
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
      <Box sx={{ mt: 'auto', p: 2, borderTop: `1px solid ${BORDER}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#4CAF50' }} />
          <Typography variant="caption" sx={{ color: TEXT_SECONDARY, fontSize: '0.7rem' }}>
            ServiceNow Connected
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: TEXT_SECONDARY, fontSize: '0.65rem', display: 'block', mt: 0.25 }}>
          PRENEED_DEMO instance
        </Typography>
      </Box>
    </Drawer>
  );
}

export { DRAWER_WIDTH };
