import {
  Box, Card, CardContent, Typography, Grid, Table, TableBody, TableCell,
  TableHead, TableRow, Button, Chip, Tab, Tabs, Alert, LinearProgress, Divider,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useState } from 'react';
import { MOCK_COMMISSIONS, MOCK_AGENTS } from '../../services/mock/mockData';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useApp } from '../../store/AppContext';
import { BORDER, CYAN, TEXT_SECONDARY } from '../../theme/tokens';
import { COMMISSION_STATUS_LABELS, COMMISSION_TYPE_LABELS } from '../../types/commission.types';
import { simulateNIPRDelay } from '../../services/mock/delay';

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  active:     { bg: '#0f2a15', text: '#66BB6A', border: '#1a4a22' },
  pending:    { bg: '#2a2010', text: '#FFB74D', border: '#4a3810' },
  terminated: { bg: '#4a1a1a', text: '#EF5350', border: '#EF5350' },
  earned:     { bg: '#0a2510', text: '#4CAF50', border: '#1a4020' },
  pending_c:  { bg: '#1a2a4a', text: '#64B5F6', border: '#1e3a6e' },
  paid:       { bg: '#0f2a15', text: '#66BB6A', border: '#1a4a22' },
  charged_back: { bg: '#4a1a1a', text: '#EF5350', border: '#EF5350' },
};

export default function ProducerServicesPage() {
  const { addNotification } = useApp();
  const [tab, setTab] = useState(0);
  const [niprLoading, setNiprLoading] = useState<Record<string, boolean>>({});

  const agent = MOCK_AGENTS[0];
  const commissions = MOCK_COMMISSIONS;

  const ytdEarned = commissions.filter(c => c.status === 'earned' || c.status === 'paid').reduce((s, c) => s + c.commissionAmount, 0);
  const ytdPending = commissions.filter(c => c.status === 'pending').reduce((s, c) => s + c.commissionAmount, 0);
  const ytdPaid = commissions.filter(c => c.status === 'paid').reduce((s, c) => s + c.commissionAmount, 0);

  const verifyNIPR = async (appointmentId: string) => {
    setNiprLoading(prev => ({ ...prev, [appointmentId]: true }));
    await simulateNIPRDelay();
    setNiprLoading(prev => ({ ...prev, [appointmentId]: false }));
    addNotification('NIPR verification complete — License status confirmed active.', 'success');
  };

  return (
    <>
      <PageHeader
        title="Producer Services & Commissions"
        subtitle={`${agent.firstName} ${agent.lastName} — NPN: ${agent.npn} · Agent ID: ${agent.agentId}`}
      />

      {/* Agent Summary */}
      <Card sx={{ mb: 3, border: `1px solid rgba(0,174,239,0.3)`, bgcolor: 'rgba(0,174,239,0.04)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="overline" sx={{ color: CYAN, display: 'block', mb: 0.5 }}>Agent Profile</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>{agent.firstName} {agent.lastName}</Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 0.5, flexWrap: 'wrap' }}>
                <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>Email: {agent.email}</Typography>
                <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>Phone: {agent.phone}</Typography>
                <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>Hire Date: {formatDate(agent.hireDate)}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip label={`License: ${agent.licenseStatus.toUpperCase()}`} sx={{ bgcolor: '#0f2a15', color: '#66BB6A', border: '1px solid #1a4a22', fontWeight: 700 }} />
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="YTD Commissions Earned" value={formatCurrency(ytdEarned, 0)} color={CYAN} /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="YTD Commissions Paid" value={formatCurrency(ytdPaid, 0)} color="#66BB6A" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="Pending Commissions" value={formatCurrency(ytdPending, 0)} color="#FFB74D" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="Active State Appointments" value={agent.appointments.filter(a => a.status === 'active').length} color={CYAN} /></Grid>
      </Grid>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Commission Summary" />
        <Tab label="State Appointments" />
        <Tab label="NIPR Verification" />
      </Tabs>

      {tab === 0 && (
        <Card sx={{ border: `1px solid ${BORDER}` }}>
          <CardContent>
            <Typography variant="overline" sx={{ mb: 2, display: 'block' }}>Commission Detail</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Policy #</TableCell>
                  <TableCell>Insured</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Sale Date</TableCell>
                  <TableCell>Face Amount</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Rate</TableCell>
                  <TableCell>Commission</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {commissions.map(c => {
                  const statusKey = c.status === 'pending' ? 'pending_c' : c.status;
                  const sc = STATUS_COLORS[statusKey] ?? STATUS_COLORS['pending_c'];
                  return (
                    <TableRow key={c.sys_id} hover>
                      <TableCell sx={{ fontSize: '0.75rem', color: TEXT_SECONDARY }}>{c.policyNumber}</TableCell>
                      <TableCell sx={{ fontSize: '0.82rem', fontWeight: 600 }}>{c.insuredName}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', color: TEXT_SECONDARY }}>{c.productName}</TableCell>
                      <TableCell sx={{ fontSize: '0.78rem' }}>{formatDate(c.saleDate)}</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: CYAN }}>{formatCurrency(c.faceAmount, 0)}</TableCell>
                      <TableCell><Chip label={COMMISSION_TYPE_LABELS[c.commissionType]} size="small" sx={{ bgcolor: 'rgba(0,0,0,0.3)', fontSize: '0.62rem' }} /></TableCell>
                      <TableCell sx={{ fontSize: '0.78rem', color: TEXT_SECONDARY }}>{(c.commissionRate * 100).toFixed(0)}%</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#66BB6A' }}>{formatCurrency(c.commissionAmount)}</TableCell>
                      <TableCell><Chip label={COMMISSION_STATUS_LABELS[c.status]} size="small" sx={{ bgcolor: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, fontSize: '0.65rem', fontWeight: 600 }} /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '160px 100px', gap: '4px 8px' }}>
                {[
                  ['Total Earned:', formatCurrency(ytdEarned)],
                  ['Total Paid:', formatCurrency(ytdPaid)],
                  ['Net Pending:', formatCurrency(ytdEarned - ytdPaid)],
                ].map(([k, v]) => (
                  <>
                    <Typography key={`k-${k}`} sx={{ fontSize: '0.78rem', color: TEXT_SECONDARY, textAlign: 'right' }}>{k}</Typography>
                    <Typography key={`v-${k}`} sx={{ fontSize: '0.85rem', fontWeight: 700, color: CYAN, textAlign: 'right' }}>{v}</Typography>
                  </>
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {tab === 1 && (
        <Card sx={{ border: `1px solid ${BORDER}` }}>
          <CardContent>
            <Typography variant="overline" sx={{ mb: 2, display: 'block' }}>State Appointments — {agent.firstName} {agent.lastName}</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>State</TableCell>
                  <TableCell>License #</TableCell>
                  <TableCell>Line of Authority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Effective</TableCell>
                  <TableCell>Expires</TableCell>
                  <TableCell>NIPR Verified</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {agent.appointments.map(appt => {
                  const sc = STATUS_COLORS[appt.status] ?? STATUS_COLORS['pending'];
                  return (
                    <TableRow key={appt.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{appt.state} ({appt.stateCode})</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', fontFamily: 'monospace', color: TEXT_SECONDARY }}>{appt.licenseNumber}</TableCell>
                      <TableCell sx={{ fontSize: '0.78rem' }}>{appt.lineOfAuthority}</TableCell>
                      <TableCell><Chip label={appt.status.charAt(0).toUpperCase() + appt.status.slice(1)} size="small" sx={{ bgcolor: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, fontSize: '0.65rem', fontWeight: 600 }} /></TableCell>
                      <TableCell sx={{ fontSize: '0.78rem' }}>{formatDate(appt.effectiveDate)}</TableCell>
                      <TableCell sx={{ fontSize: '0.78rem' }}>{formatDate(appt.expirationDate)}</TableCell>
                      <TableCell>
                        {appt.niprVerified
                          ? <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><VerifiedIcon sx={{ fontSize: 14, color: '#66BB6A' }} /><Typography variant="caption" sx={{ color: '#66BB6A' }}>Verified {formatDate(appt.lastVerifiedDate)}</Typography></Box>
                          : <Chip label="Pending Verification" size="small" sx={{ bgcolor: '#2a2010', color: '#FFB74D', border: '1px solid #FFB74D', fontSize: '0.65rem' }} />
                        }
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {tab === 2 && (
        <Card sx={{ border: `1px solid ${BORDER}` }}>
          <CardContent>
            <Typography variant="overline" sx={{ mb: 1, display: 'block' }}>NIPR License Verification</Typography>
            <Alert severity="info" sx={{ mb: 2, fontSize: '0.8rem' }}>
              Verify agent state license status in real-time via NIPR (National Insurance Producer Registry). Verification typically takes 1-2 seconds.
            </Alert>
            {agent.appointments.map(appt => (
              <Box key={appt.id} sx={{ p: 2, border: `1px solid ${BORDER}`, borderRadius: 1.5, mb: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.88rem' }}>{appt.state} — {appt.licenseNumber}</Typography>
                    <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>{appt.lineOfAuthority} · Expires: {formatDate(appt.expirationDate)}</Typography>
                    <Box sx={{ mt: 0.5 }}>
                      {appt.niprVerified
                        ? <Typography variant="caption" sx={{ color: '#66BB6A' }}>✓ Last verified: {formatDate(appt.lastVerifiedDate)}</Typography>
                        : <Typography variant="caption" sx={{ color: '#FFB74D' }}>⚠ Verification pending</Typography>
                      }
                    </Box>
                  </Box>
                  <Button
                    variant={appt.niprVerified ? 'outlined' : 'contained'}
                    color="secondary"
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={() => verifyNIPR(appt.id)}
                    disabled={niprLoading[appt.id]}
                  >
                    {niprLoading[appt.id] ? 'Verifying...' : appt.niprVerified ? 'Re-verify' : 'Verify Now'}
                  </Button>
                </Box>
                {niprLoading[appt.id] && <LinearProgress color="secondary" sx={{ mt: 1, borderRadius: 1 }} />}
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );
}
