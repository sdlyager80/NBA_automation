import {
  Box, Card, CardContent, Typography, Grid, Table, TableBody, TableCell,
  TableHead, TableRow, Button, Chip, Tab, Tabs, Alert, TextField, Divider,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { MOCK_LAPSE_NOTICES } from '../../services/mock/mockData';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useApp } from '../../store/AppContext';
import { BORDER, CYAN, TEXT_SECONDARY } from '../../theme/tokens';

const PENDING_BATCH = [
  { id: 'batch-001', date: '2026-03-12', count: 8, amount: 1847.64, method: 'ACH', status: 'pending' },
  { id: 'batch-002', date: '2026-03-11', count: 3, amount: 651.21, method: 'ACH', status: 'pending' },
];

export default function BillingOperationsPage() {
  const { addNotification } = useApp();
  const [tab, setTab] = useState(0);
  const [lapseNotices, setLapseNotices] = useState(MOCK_LAPSE_NOTICES);

  const approveBatch = (id: string) => {
    addNotification(`Batch ${id} approved and submitted for processing.`, 'success');
  };

  const sendNotice = (id: string) => {
    setLapseNotices(prev => prev.map(n => n.sys_id === id ? { ...n, status: 'notice_sent' as const, noticesSentCount: n.noticesSentCount + 1, lastNoticeSentDate: new Date().toISOString().split('T')[0] } : n));
    addNotification('Lapse notice sent to insured and agent.', 'success');
  };

  return (
    <>
      <PageHeader title="Billing Operations" subtitle="Payment processing queue, lapse notices, and reinstatements" />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="Pending Batches" value={PENDING_BATCH.length} color={CYAN} /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="Lapse Notices Open" value={lapseNotices.filter(n => n.status === 'open').length} color="#EF5350" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="Reinstatement Requests" value={1} color="#FFB74D" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="MTD Processed" value="$2,498" color="#66BB6A" /></Grid>
      </Grid>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Payment Processing Queue" />
        <Tab label="Lapse Notices" />
        <Tab label="Reinstatements" />
      </Tabs>

      {tab === 0 && (
        <Card sx={{ border: `1px solid ${BORDER}` }}>
          <CardContent>
            <Typography variant="overline" sx={{ mb: 2, display: 'block' }}>Pending Payment Batches</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Batch ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Transactions</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {PENDING_BATCH.map(batch => (
                  <TableRow key={batch.id} hover>
                    <TableCell sx={{ fontSize: '0.78rem', color: TEXT_SECONDARY }}>{batch.id}</TableCell>
                    <TableCell sx={{ fontSize: '0.82rem' }}>{formatDate(batch.date)}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{batch.count}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: CYAN }}>{formatCurrency(batch.amount)}</TableCell>
                    <TableCell sx={{ fontSize: '0.78rem' }}>{batch.method}</TableCell>
                    <TableCell><Chip label="Pending Approval" size="small" sx={{ bgcolor: '#2a2010', color: '#FFB74D', border: '1px solid #4a3810', fontSize: '0.65rem' }} /></TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Button size="small" startIcon={<CheckIcon />} sx={{ color: '#66BB6A', fontSize: '0.72rem' }} onClick={() => approveBatch(batch.id)}>Approve</Button>
                        <Button size="small" startIcon={<CloseIcon />} sx={{ color: '#EF5350', fontSize: '0.72rem' }}>Reject</Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {tab === 1 && (
        <Card sx={{ border: `1px solid ${BORDER}` }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="overline">Lapse Notice Queue</Typography>
              <Button size="small" variant="outlined" color="secondary">Generate Bulk Notices</Button>
            </Box>
            {lapseNotices.map(notice => (
              <Box key={notice.sys_id} sx={{ p: 2, border: `1px solid ${notice.status === 'open' ? '#EF5350' : BORDER}`, borderRadius: 1.5, mb: 1.5, bgcolor: notice.status === 'open' ? 'rgba(239,83,80,0.04)' : 'transparent' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.88rem' }}>{notice.insuredName} — {notice.policyNumber}</Typography>
                    <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>{notice.agentName} · {notice.funeralHomeName}</Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 0.75, flexWrap: 'wrap' }}>
                      <Typography variant="caption" sx={{ color: '#EF5350', fontWeight: 700 }}>Past Due: {formatCurrency(notice.pastDueAmount)}</Typography>
                      <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>Days Lapsed: {notice.daysLapsed}</Typography>
                      <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>Grace Period Ends: {formatDate(notice.gracePeriodEnd)}</Typography>
                      <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>Notices Sent: {notice.noticesSentCount}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                    <Button size="small" variant="outlined" color="secondary" onClick={() => sendNotice(notice.sys_id)}>Send Notice</Button>
                    <Button size="small" sx={{ color: '#66BB6A', border: '1px solid #66BB6A' }}>Reinstate</Button>
                  </Box>
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {tab === 2 && (
        <Card sx={{ border: `1px solid ${BORDER}` }}>
          <CardContent>
            <Typography variant="overline" sx={{ mb: 2, display: 'block' }}>Reinstatement Requests</Typography>
            <Alert severity="warning" sx={{ mb: 2, fontSize: '0.8rem' }}>
              <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Policy PNP-2025-00763 — George Turner</Typography>
              <Typography sx={{ fontSize: '0.8rem' }}>Reinstatement requested. Policy lapsed 12 days ago. Back-premium + reinstatement fee required.</Typography>
            </Alert>
            <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1.5, mb: 2 }}>
              <Grid container spacing={2}>
                {[
                  ['Policy #', 'PNP-2025-00763'],
                  ['Insured', 'George Turner'],
                  ['Lapse Date', 'Feb 28, 2026'],
                  ['Days Lapsed', '12'],
                  ['Back-Premium Required', '$449.16 (2 months × $224.58)'],
                  ['Reinstatement Fee', '$25.00'],
                  ['Total Required', '$474.16'],
                ].map(([k, v]) => (
                  <Grid size={{ xs: 6, sm: 4 }} key={k}>
                    <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>{k}</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>{v}</Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button variant="contained" color="secondary">Approve Reinstatement</Button>
              <Button variant="outlined" sx={{ color: '#EF5350', borderColor: '#EF5350' }}>Deny</Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </>
  );
}
