import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { TEXT_SECONDARY } from '../../theme/tokens';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
      <Box>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs sx={{ mb: 0.5, '& .MuiBreadcrumbs-separator': { color: TEXT_SECONDARY } }}>
            {breadcrumbs.map((crumb, i) => (
              crumb.href
                ? <Link key={i} href={crumb.href} underline="hover" sx={{ fontSize: '0.75rem', color: TEXT_SECONDARY }}>{crumb.label}</Link>
                : <Typography key={i} sx={{ fontSize: '0.75rem', color: TEXT_SECONDARY }}>{crumb.label}</Typography>
            ))}
          </Breadcrumbs>
        )}
        <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{title}</Typography>
        {subtitle && <Typography variant="body2" sx={{ mt: 0.5, color: TEXT_SECONDARY }}>{subtitle}</Typography>}
      </Box>
      {actions && <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexShrink: 0 }}>{actions}</Box>}
    </Box>
  );
}
