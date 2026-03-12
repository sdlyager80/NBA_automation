import {
  Box, Card, CardContent, Typography, Grid, Table, TableBody, TableCell,
  TableHead, TableRow, Button, Chip, Tab, Tabs, TextField, InputAdornment,
  FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useState } from 'react';
import { MOCK_FINANCIAL_TRANSACTIONS } from '../../services/mock/mockData';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useApp } from '../../store/AppContext';
import { BORDER, CYAN, TEXT_SECONDARY } from '../../theme/tokens';

const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  premium_received: 'Premium Received',
  commission_paid: 'Commission Paid',
  refund: 'Refund',
  remittance: 'Remittance',
  nsf_charge: 'NSF Charge',
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  premium_received: { bg: '#0f2a15', text: '#66BB6A' },
  commission_paid:  { bg: '#2a1a10', text: '#FFA726' },
  refund:           { bg: '#4a1a1a', text: '#EF5350' },
  remittance:       { bg: '#1a2a4a', text: '#64B5F6' },
  nsf_charge:       { bg: '#4a1a1a', text: '#EF5350' },
};

const MONTHLY_DATA = [
  { month: 'Jan', premiums: 3420, commissions: 410 },
  { month: 'Feb', premiums: 2890, commissions: 347 },
  { month: 'Mar', premiums: 1847, commissions: 222 },
];

export default function FinancialServicesPage() {
  const { addNotification } = useApp();
  const [tab, setTab] = useState(0);
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = MOCK_FINANCIAL_TRANSACTIONS.filter(t => typeFilter === 'all' || t.type === typeFilter);
  const mtdPremiums = MOCK_FINANCIAL_TRANSACTIONS.filter(t => t.type === 'premium_received').reduce((s, t) => s + t.amount, 0);
  const mtdCommissions = Math.abs(MOCK_FINANCIAL_TRANSACTIONS.filter(t => t.type === 'commission_paid').reduce((s, t) => s + t.amount, 0));

  return (
    <>
      <PageHeader
        title="Financial Services"
        subtitle="Transaction ledger, premium reports, and remittance management"
        actions={
          <Button variant="outlined" color="secondary" startIcon={<DownloadIcon />} onClick={() => addNotification('Report exported to CSV.', 'success')}>
            Export Report
          </Button>
        }
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="MTD Premiums Received" value={formatCurrency(mtdPremiums, 0)} color={CYAN} /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="MTD Commissions Paid" value={formatCurrency(mtdCommissions, 0)} color="#FFA726" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="Pending Remittances" value={3} color="#64B5F6" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="Net MTD" value={formatCurrency(mtdPremiums - mtdCommissions, 0)} color="#66BB6A" /></Grid>
      </Grid>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Transaction Ledger" />
        <Tab label="Premium Reports" />
        <Tab label="Remittance" />
      </Tabs>

      {tab === 0 && (
        <Card sx={{ border: `1px solid ${BORDER}` }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
              <FormControl size="small" sx={{ width: 200 }}>
                <InputLabel>Transaction Type</InputLabel>
                <Select value={typeFilter} label="Transaction Type" onChange={e => setTypeFilter(e.target.value)}>
                  <MenuItem value="all">All Types</MenuItem>
                  {Object.entries(TRANSACTION_TYPE_LABELS).map(([k, v]) => <MenuItem key={k} value={k}>{v}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField size="small" label="From Date" type="date" InputLabelProps={{ shrink: true }} defaultValue="2026-01-01" sx={{ width: 160 }} />
              <TextField size="small" label="To Date" type="date" InputLabelProps={{ shrink: true }} defaultValue="2026-03-12" sx={{ width: 160 }} />
              <Button size="small" startIcon={<DownloadIcon />} sx={{ color: TEXT_SECONDARY, ml: 'auto' }} onClick={() => addNotification('Ledger exported.', 'success')}>Export CSV</Button>
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Policy / Agent</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map(txn => {
                  const typeColor = TYPE_COLORS[txn.type] ?? { bg: 'transparent', text: TEXT_SECONDARY };
                  return (
                    <TableRow key={txn.sys_id} hover>
                      <TableCell sx={{ fontSize: '0.72rem', color: TEXT_SECONDARY, fontFamily: 'monospace' }}>{txn.transactionId}</TableCell>
                      <TableCell>
                        <Chip label={TRANSACTION_TYPE_LABELS[txn.type]} size="small"
                          sx={{ bgcolor: typeColor.bg, color: typeColor.text, fontSize: '0.65rem', fontWeight: 600, border: `1px solid ${typeColor.text}30` }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.78rem' }}>{formatDate(txn.transactionDate)}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', color: TEXT_SECONDARY }}>{txn.policyNumber ?? txn.agentId ?? '—'}</TableCell>
                      <TableCell sx={{ fontSize: '0.78rem', maxWidth: 200 }}>{txn.description}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: txn.amount > 0 ? '#66BB6A' : '#EF5350', fontFamily: 'monospace' }}>
                        {txn.amount >= 0 ? '+' : ''}{formatCurrency(txn.amount)}
                      </TableCell>
                      <TableCell>
                        <Chip label={txn.status} size="small" sx={{ bgcolor: txn.status === 'posted' ? '#0f2a15' : '#2a2010', color: txn.status === 'posted' ? '#66BB6A' : '#FFB74D', fontSize: '0.65rem', border: 'none' }} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {tab === 1 && (
        <Card sx={{ border: `1px solid ${BORDER}` }}>
          <CardContent>
            <Typography variant="overline" sx={{ mb: 2, display: 'block' }}>Premium Volume by Month</Typography>
            {/* Simple bar chart representation */}
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 200, mb: 3, p: 2, bgcolor: 'rgba(0,0,0,0.15)', borderRadius: 1.5 }}>
              {MONTHLY_DATA.map(m => {
                const maxVal = 5000;
                const premiumH = (m.premiums / maxVal) * 160;
                const commissionH = (m.commissions / maxVal) * 160;
                return (
                  <Box key={m.month} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-end', height: 160 }}>
                      <Box sx={{ width: 28, height: premiumH, bgcolor: CYAN, borderRadius: '3px 3px 0 0', position: 'relative' }}>
                        <Typography sx={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', fontSize: '0.65rem', color: CYAN, fontWeight: 700, whiteSpace: 'nowrap' }}>{formatCurrency(m.premiums, 0)}</Typography>
                      </Box>
                      <Box sx={{ width: 28, height: commissionH, bgcolor: '#FFA726', borderRadius: '3px 3px 0 0', position: 'relative' }}>
                        <Typography sx={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', fontSize: '0.65rem', color: '#FFA726', fontWeight: 700, whiteSpace: 'nowrap' }}>{formatCurrency(m.commissions, 0)}</Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption" sx={{ color: TEXT_SECONDARY, fontWeight: 600 }}>{m.month}</Typography>
                  </Box>
                );
              })}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2, justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 12, height: 12, bgcolor: CYAN, borderRadius: 0.5 }} /><Typography variant="caption">Premiums Received</Typography></Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 12, height: 12, bgcolor: '#FFA726', borderRadius: 0.5 }} /><Typography variant="caption">Commissions Paid</Typography></Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {tab === 2 && (
        <Card sx={{ border: `1px solid ${BORDER}` }}>
          <CardContent>
            <Typography variant="overline" sx={{ mb: 2, display: 'block' }}>Pending Funeral Home Remittances</Typography>
            {[
              { fh: 'Eternal Rest Funeral Home', amount: 1243.45, policies: 3, period: 'March 2026' },
              { fh: 'Harmony Chapel Funeral Home', amount: 879.22, policies: 2, period: 'March 2026' },
              { fh: 'Serenity Gardens Memorial', amount: 412.00, policies: 1, period: 'March 2026' },
            ].map(item => (
              <Box key={item.fh} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, border: `1px solid ${BORDER}`, borderRadius: 1.5, mb: 1.5 }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.88rem' }}>{item.fh}</Typography>
                  <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>{item.policies} policies · Period: {item.period}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontWeight: 700, color: CYAN, fontSize: '1rem' }}>{formatCurrency(item.amount)}</Typography>
                  <Button size="small" variant="outlined" color="secondary" sx={{ fontSize: '0.7rem' }} onClick={() => addNotification(`Remittance file generated for ${item.fh}`, 'success')}>
                    Generate File
                  </Button>
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );
}
