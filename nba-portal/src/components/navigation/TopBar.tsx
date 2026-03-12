import {
  AppBar, Toolbar, IconButton, Typography, Box, Avatar, Menu, MenuItem,
  Chip, Tooltip, Divider, ListItemIcon, ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { useApp } from '../../store/AppContext';
import { ROLE_LABELS } from '../../types/user.types';
import { ROYAL, TRUE_BLUE, BORDER, TEXT_SECONDARY, TEXT_MUTED, MIDNIGHT } from '../../theme/tokens';

export default function TopBar() {
  const { user, setUser, personas } = useAuth();
  const { setSidebarOpen, sidebarOpen } = useApp();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [personaAnchor, setPersonaAnchor] = useState<null | HTMLElement>(null);

  return (
    <AppBar position="fixed" elevation={0} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height: 56, justifyContent: 'center' }}>
      <Toolbar sx={{ minHeight: '56px !important', gap: 1 }}>
        <IconButton edge="start" onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ color: TEXT_SECONDARY, mr: 0.5 }}>
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Box sx={{
            width: 30, height: 30, borderRadius: 1.5,
            background: `linear-gradient(135deg, ${ROYAL} 0%, ${TRUE_BLUE} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 2px 8px rgba(0,74,172,0.35)`,
          }}>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>B</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, lineHeight: 1, color: MIDNIGHT, letterSpacing: '-0.3px' }}>Bloom</Typography>
            <Typography sx={{ fontSize: '0.62rem', color: TEXT_MUTED, lineHeight: 1.2 }}>Insurance Portal</Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Demo persona switcher */}
        <Tooltip title="Switch Demo Persona">
          <Chip
            label={`Demo: ${user.name}`}
            size="small"
            onClick={(e) => setPersonaAnchor(e.currentTarget)}
            sx={{
              bgcolor: `rgba(0,74,172,0.07)`,
              color: ROYAL,
              border: `1px solid rgba(0,74,172,0.2)`,
              fontWeight: 600,
              fontSize: '0.72rem',
              cursor: 'pointer',
              '&:hover': { bgcolor: `rgba(0,74,172,0.12)` },
            }}
          />
        </Tooltip>

        <Menu
          anchorEl={personaAnchor}
          open={Boolean(personaAnchor)}
          onClose={() => setPersonaAnchor(null)}
          PaperProps={{ sx: { minWidth: 220, mt: 0.5 } }}
        >
          <Box sx={{ px: 2, py: 1.25 }}>
            <Typography variant="overline">Switch Persona</Typography>
          </Box>
          <Divider />
          {personas.map(p => (
            <MenuItem
              key={p.sys_id}
              selected={p.sys_id === user.sys_id}
              onClick={() => { setUser(p); setPersonaAnchor(null); navigate('/'); }}
              sx={{ gap: 1.5, py: 1 }}
            >
              <Avatar sx={{ width: 30, height: 30, bgcolor: p.avatarColor, fontSize: '0.7rem', fontWeight: 700 }}>{p.avatarInitials}</Avatar>
              <Box>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.3 }}>{p.name}</Typography>
                <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>{ROLE_LABELS[p.role]}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>

        <IconButton sx={{ color: TEXT_SECONDARY, '&:hover': { color: MIDNIGHT } }}>
          <NotificationsOutlinedIcon fontSize="small" />
        </IconButton>

        <Tooltip title={`${user.name} — ${ROLE_LABELS[user.role]}`}>
          <Avatar
            sx={{
              width: 32, height: 32, bgcolor: user.avatarColor, fontSize: '0.75rem', fontWeight: 700,
              cursor: 'pointer', border: `2px solid ${BORDER}`,
              '&:hover': { borderColor: ROYAL },
              transition: 'border-color 0.15s',
            }}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            {user.avatarInitials}
          </Avatar>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{ sx: { minWidth: 200, mt: 0.5 } }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{user.name}</Typography>
            <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>{ROLE_LABELS[user.role]}</Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => setAnchorEl(null)}><ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon><ListItemText>Profile</ListItemText></MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}><ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon><ListItemText>Sign Out</ListItemText></MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
