import { Card, CardContent, Typography, Box, type SxProps } from '@mui/material';
import { NAVY_DARK, BORDER, CYAN } from '../../theme/tokens';

interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
  icon?: React.ReactNode;
  trend?: { value: string; positive: boolean };
  onClick?: () => void;
  sx?: SxProps;
}

export default function StatCard({ label, value, color = CYAN, icon, trend, onClick, sx }: StatCardProps) {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        border: `1px solid ${BORDER}`,
        transition: 'all 0.15s',
        '&:hover': onClick ? { borderColor: CYAN, transform: 'translateY(-2px)', boxShadow: `0 4px 20px rgba(0,174,239,0.1)` } : {},
        ...sx,
      }}
    >
      <CardContent sx={{ p: '14px 16px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, fontSize: '0.68rem' }}>
            {label}
          </Typography>
          {icon && <Box sx={{ color, opacity: 0.7, '& svg': { fontSize: 20 } }}>{icon}</Box>}
        </Box>
        <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </Typography>
        {trend && (
          <Typography variant="caption" sx={{ color: trend.positive ? '#4CAF50' : '#F44336', fontWeight: 600 }}>
            {trend.positive ? '▲' : '▼'} {trend.value}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
