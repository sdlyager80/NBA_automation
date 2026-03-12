import {
  Box, Grid, Card, CardContent, Typography, Chip, Avatar, Button,
  Table, TableBody, TableCell, TableHead, TableRow, Alert,
  List, ListItem, ListItemAvatar, ListItemText, IconButton, Divider,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SendIcon from '@mui/icons-material/Send';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PaymentIcon from '@mui/icons-material/Payment';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { MOCK_APPLICATIONS } from '../../services/mock/mockData';
import StatCard from '../../components/common/StatCard';
import StatusChip from '../../components/common/StatusChip';
import PageHeader from '../../components/common/PageHeader';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { NAVY_LIGHT, CYAN, BORDER, TEXT_SECONDARY, NAVY_DARK, NAVY_SURFACE } from '../../theme/tokens';

function AgentDashboard() {
  const navigate = useNavigate();
  const apps = MOCK_APPLICATIONS;
  const active = apps.filter(a => a.status === 'approved' || a.status === 'issued').length;
  const pending = apps.filter(a => a.status === 'pending_review').length;
  const payPending = apps.filter(a => a.status === 'pending_payment').length;
  const nigo = apps.filter(a => a.status === 'nigo').length;

  return (
    <>
      <PageHeader
        title="Agent Dashboard"
        subtitle="Eternal Rest Funeral Home — License #TX-AG-28471 · March 12, 2026"
        actions={
          <>
            <Button variant="contained" color="secondary" startIcon={<AddCircleOutlineIcon />} onClick={() => navigate('/applications/new')}>
              New Application
            </Button>
            <Button variant="outlined" color="secondary" startIcon={<SendIcon />}>
              Send Payment Link
            </Button>
          </>
        }
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="Total Active Cases" value={apps.length} color={CYAN} /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="Pending / In Review" value={pending} color="#FFB74D" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="Approved – Active" value={active} color="#66BB6A" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="Payment Pending" value={payPending} color="#FFA726" /></Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={1.5} sx={{ mb: 3 }}>
        {[
          { icon: '📝', label: 'Start New Application', action: () => navigate('/applications/new') },
          { icon: '💳', label: 'Send Payment Link', action: () => {} },
          { icon: '📋', label: 'View All Cases', action: () => navigate('/cases/my') },
          { icon: '🏦', label: 'Enter Payment Directly', action: () => navigate('/bill-pay') },
        ].map(qa => (
          <Grid size={{ xs: 6, sm: 3 }} key={qa.label}>
            <Card
              onClick={qa.action}
              sx={{
                cursor: 'pointer', textAlign: 'center', p: 2,
                border: `1px solid ${BORDER}`, transition: 'all 0.15s',
                '&:hover': { borderColor: CYAN, transform: 'translateY(-2px)', boxShadow: `0 4px 16px rgba(0,174,239,0.1)` },
              }}
            >
              <Typography sx={{ fontSize: '1.5rem', mb: 0.5 }}>{qa.icon}</Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{qa.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        {/* Recent Cases */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ border: `1px solid ${BORDER}` }}>
            <CardContent sx={{ pb: '16px !important' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="overline">Recent Cases</Typography>
                <Button size="small" endIcon={<ArrowForwardIcon />} sx={{ color: CYAN, fontSize: '0.75rem' }} onClick={() => navigate('/cases/my')}>
                  View All
                </Button>
              </Box>
              {apps.slice(0, 6).map(app => (
                <Box
                  key={app.sys_id}
                  onClick={() => navigate(`/cases/${app.sys_id}`)}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 2, p: 1.5,
                    borderRadius: 1.5, cursor: 'pointer', mb: 0.75,
                    border: `1px solid ${BORDER}`, transition: 'all 0.12s',
                    '&:hover': { borderColor: CYAN, bgcolor: 'rgba(0,174,239,0.03)' },
                  }}
                >
                  <Avatar sx={{ width: 34, height: 34, bgcolor: app.status === 'approved' ? '#1a4a22' : app.status === 'nigo' ? '#4a1a1a' : '#1a2a4a', fontSize: '0.7rem', fontWeight: 700 }}>
                    {`${app.insured.firstName[0]}${app.insured.lastName[0]}`}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>{app.insured.firstName} {app.insured.lastName}</Typography>
                    <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>{app.productName} — {formatCurrency(app.faceAmount, 0)} · {app.funeralHome.name}</Typography>
                    <Typography variant="caption" sx={{ color: TEXT_SECONDARY, display: 'block' }}>{app.caseNumber} · Submitted {formatDate(app.submittedAt ?? app.createdAt)}</Typography>
                  </Box>
                  <StatusChip status={app.status} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ border: `1px solid ${BORDER}` }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="overline">Notifications & Tasks</Typography>
                <Chip label={`${nigo + payPending} new`} size="small" sx={{ bgcolor: '#4a1a1a', color: '#EF5350', border: '1px solid #EF5350', fontSize: '0.65rem', fontWeight: 700 }} />
              </Box>
              {nigo > 0 && (
                <Alert severity="error" sx={{ mb: 1, borderLeft: '3px solid #EF5350', fontSize: '0.78rem' }}>
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 700 }}>⚠ NIGO — Robert Williams (NB-2025-0844)</Typography>
                  <Typography variant="caption">Missing beneficiary designation. Click to review.</Typography>
                </Alert>
              )}
              <Alert severity="success" sx={{ mb: 1, fontSize: '0.78rem' }}>
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700 }}>✅ Policy Issued — Anna Rodriguez</Typography>
                <Typography variant="caption">Policy #PNP-2026-00847 approved and active.</Typography>
              </Alert>
              {payPending > 0 && (
                <Alert severity="warning" sx={{ mb: 1, fontSize: '0.78rem' }}>
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 700 }}>⏳ Payment Pending — Margaret Chen</Typography>
                  <Typography variant="caption">Customer has not completed payment setup. 3 days since approval.</Typography>
                </Alert>
              )}
              <Alert severity="info" sx={{ fontSize: '0.78rem' }}>
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700 }}>📋 NIPR Verified — James Fletcher</Typography>
                <Typography variant="caption">TX state appointment confirmed. Proceeding to underwriting.</Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

function BackOfficeDashboard() {
  const apps = MOCK_APPLICATIONS;
  const navigate = useNavigate();
  const totalApps = apps.length;
  const pending = apps.filter(a => a.status === 'pending_review').length;
  const nigo = apps.filter(a => a.status === 'nigo').length;

  return (
    <>
      <PageHeader title="Operations Dashboard" subtitle="Back Office — New Business Processing" />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="Total Applications" value={totalApps} color={CYAN} /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="Pending Review" value={pending} color="#FFB74D" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="NIGO / Exceptions" value={nigo} color="#EF5350" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="Issued Today" value={2} color="#66BB6A" /></Grid>
      </Grid>
      <Card sx={{ border: `1px solid ${BORDER}` }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="overline">Application Queue</Typography>
            <Button size="small" color="secondary" onClick={() => navigate('/cases')}>View All Cases →</Button>
          </Box>
          <Table size="small">
            <TableHead>
              <TableRow><TableCell>Applicant</TableCell><TableCell>Case #</TableCell><TableCell>Product</TableCell><TableCell>Coverage</TableCell><TableCell>Status</TableCell><TableCell>Submitted</TableCell></TableRow>
            </TableHead>
            <TableBody>
              {apps.map(app => (
                <TableRow key={app.sys_id} onClick={() => navigate(`/cases/${app.sys_id}`)} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{app.insured.firstName} {app.insured.lastName}</TableCell>
                  <TableCell sx={{ color: TEXT_SECONDARY, fontSize: '0.78rem' }}>{app.caseNumber}</TableCell>
                  <TableCell sx={{ fontSize: '0.78rem' }}>{app.productName}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: CYAN }}>{formatCurrency(app.faceAmount, 0)}</TableCell>
                  <TableCell><StatusChip status={app.status} /></TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: TEXT_SECONDARY }}>{formatDate(app.submittedAt ?? app.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

function CustomerDashboard() {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader title="Welcome, Anna" subtitle="Your preneed policy is approved and active." />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ border: `1px solid ${BORDER}` }}>
            <CardContent>
              <Typography variant="overline" sx={{ mb: 2, display: 'block' }}>Your Policy</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Serenity Plus Preneed</Typography>
              <Typography sx={{ color: CYAN, fontSize: '1.5rem', fontWeight: 800, my: 0.5 }}>$12,500.00</Typography>
              <StatusChip status="approved" sx={{ mb: 1.5 }} />
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                {[
                  ['Policy #', 'PNP-2026-00847'],
                  ['Effective', 'Mar 10, 2026'],
                  ['Next Payment', 'Apr 1, 2026'],
                  ['Monthly Amount', '$224.58'],
                ].map(([k, v]) => (
                  <Box key={k}>
                    <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>{k}</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>{v}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Grid container spacing={1.5}>
            {[
              { icon: '💳', label: 'Make a Payment', path: '/bill-pay' },
              { icon: '📄', label: 'View Billing History', path: '/bill-view' },
              { icon: '✏️', label: 'Update Policy', path: '/policy-update' },
              { icon: '📞', label: 'Contact Us', path: '/' },
            ].map(item => (
              <Grid size={6} key={item.label}>
                <Card
                  onClick={() => navigate(item.path)}
                  sx={{ cursor: 'pointer', textAlign: 'center', p: 2, border: `1px solid ${BORDER}`, '&:hover': { borderColor: CYAN, transform: 'translateY(-1px)' }, transition: 'all 0.12s' }}
                >
                  <Typography sx={{ fontSize: '1.5rem', mb: 0.5 }}>{item.icon}</Typography>
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 600 }}>{item.label}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

function FinanceDashboard() {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader title="Financial Services Dashboard" subtitle="Premium collections, commissions, and remittance" />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="MTD Premiums Received" value="$1,847" color={CYAN} /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="Commissions Paid (MTD)" value="$551" color="#FFB74D" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="Pending Remittances" value={3} color="#FFA726" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="Failed Transactions" value={0} color="#66BB6A" /></Grid>
      </Grid>
      <Card sx={{ border: `1px solid ${BORDER}` }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="overline">Quick Access</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button variant="outlined" color="secondary" onClick={() => navigate('/financial-services')}>Transaction Ledger</Button>
            <Button variant="outlined" color="secondary" onClick={() => navigate('/billing-operations')}>Billing Operations</Button>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}

function ProducerDashboard() {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader title="Producer Services Dashboard" subtitle="Commissions, appointments, and licensing" />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="YTD Commissions Earned" value="$551" color={CYAN} /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="Active Appointments" value={2} color="#66BB6A" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="Pending Appointments" value={1} color="#FFB74D" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="Policies Written (YTD)" value={5} color={CYAN} /></Grid>
      </Grid>
      <Button variant="contained" color="secondary" onClick={() => navigate('/producer-services')}>View Commission Details →</Button>
    </>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  if (user.role === 'customer') return <CustomerDashboard />;
  if (user.role === 'back_office') return <BackOfficeDashboard />;
  if (user.role === 'finance') return <FinanceDashboard />;
  if (user.role === 'producer_services') return <ProducerDashboard />;
  return <AgentDashboard />;
}
