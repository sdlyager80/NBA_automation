import { Box, Snackbar, Alert } from '@mui/material';
import { Outlet } from 'react-router-dom';
import TopBar from '../../components/navigation/TopBar';
import Sidebar, { DRAWER_WIDTH } from '../../components/navigation/Sidebar';
import { useApp } from '../../store/AppContext';
import { MIDNIGHT } from '../../theme/tokens';

export default function MainLayout() {
  const { sidebarOpen, notifications, removeNotification } = useApp();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: MIDNIGHT }}>
      <TopBar />
      <Sidebar open={sidebarOpen} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: '56px',
          ml: sidebarOpen ? `${DRAWER_WIDTH}px` : 0,
          transition: 'margin 0.2s ease',
          minHeight: 'calc(100vh - 56px)',
          p: { xs: 2, sm: 3 },
          maxWidth: 1400,
          mx: 'auto',
          width: '100%',
        }}
      >
        <Outlet />
      </Box>

      {/* Notification snackbars */}
      {notifications.map((n) => (
        <Snackbar
          key={n.id}
          open
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          onClose={() => removeNotification(n.id)}
        >
          <Alert severity={n.severity} onClose={() => removeNotification(n.id)} variant="filled" sx={{ minWidth: 300 }}>
            {n.message}
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
}
