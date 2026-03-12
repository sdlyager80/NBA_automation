import {
  Box, Card, CardContent, Typography, Grid, Table, TableBody, TableCell,
  TableHead, TableRow, Button, Chip, TextField, InputAdornment, Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import { useState } from 'react';
import { MOCK_POLICIES, MOCK_PAYMENTS, MOCK_BILLING_STATEMENTS } from '../../services/mock/mockData';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { BORDER, CYAN, TEXT_SECONDARY } from '../../theme/tokens';

export default function BillViewPage() {
  const [search, setSearch] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState(MOCK_POLICIES[0]);

  return (
    <>
      <PageHeader title="Bill View" subtitle="View billing history, payment schedule, and statements" />

      <Grid container spacing={2}>
        {/* Policy Selector */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ border: `1px solid ${BORDER}`, mb: 2 }}>
            <CardContent>
              <Typography variant="overline" sx={{ mb: 2, display: 'block' }}>Select Policy</Typography>
              <TextField
                fullWidth size="small" placeholder="Search policies..."
                value={search} onChange={e => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: TEXT_SECONDARY }} /></InputAdornment> }}
                sx={{ mb: 1.5 }}
              />
              {MOCK_POLICIES.map(policy => (
                <Box
                  key={policy.sys_id}
                  onClick={() => setSelectedPolicy(policy)}
                  sx={{
                    p: 1.5, borderRadius: 1.5, cursor: 'pointer', mb: 0.75,
                    border: `1px solid ${selectedPolicy.sys_id === policy.sys_id ? CYAN : BORDER}`,
                    bgcolor: selectedPolicy.sys_id === policy.sys_id ? 'rgba(0,174,239,0.06)' : 'transparent',
                    transition: 'all 0.12s', '&:hover': { borderColor: CYAN },
                  }}
                >
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }}>{policy.policyNumber}</Typography>
                  <Typography variant="caption" sx={{ color: TEXT_SECONDARY, display: 'block' }}>{policy.insuredFirstName} {policy.insuredLastName}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                    <Typography sx={{ fontSize: '0.8rem', color: CYAN, fontWeight: 600 }}>{formatCurrency(policy.faceAmount, 0)}</Typography>
                    <StatusChip status={policy.status} />
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Policy Detail + Billing History */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Policy Summary */}
          <Card sx={{ mb: 2, border: `1px solid rgba(0,174,239,0.3)`, bgcolor: 'rgba(0,174,239,0.04)' }}>
            <CardContent>
              <Typography variant="overline" sx={{ color: CYAN, mb: 2, display: 'block' }}>Policy Summary — {selectedPolicy.policyNumber}</Typography>
              <Grid container spacing={2}>
                {[
                  ['Policy Holder', `${selectedPolicy.insuredFirstName} ${selectedPolicy.insuredLastName}`],
                  ['Coverage', formatCurrency(selectedPolicy.faceAmount)],
                  ['Product', selectedPolicy.productName],
                  ['Status', selectedPolicy.status],
                  ['Monthly Premium', formatCurrency(selectedPolicy.modalPremium)],
                  ['Next Due Date', formatDate(selectedPolicy.nextDueDate)],
                  ['Payments Made', `${60 - selectedPolicy.paymentsRemaining} of 60`],
                  ['Paid-Up Date', selectedPolicy.paidUpDate ? formatDate(selectedPolicy.paidUpDate) : '—'],
                  ['Auto-Pay', selectedPolicy.autoPayEnrolled ? 'Enrolled ✓' : 'Not Enrolled'],
                  ['Payment Method', selectedPolicy.paymentMethodLast4 ? `ACH ****${selectedPolicy.paymentMethodLast4}` : '—'],
                ].map(([k, v]) => (
                  <Grid size={{ xs: 6, sm: 4 }} key={k}>
                    <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>{k}</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: k === 'Coverage' || k === 'Monthly Premium' ? CYAN : 'inherit' }}>{k === 'Status' ? '' : v}</Typography>
                    {k === 'Status' && <StatusChip status={v as string} />}
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Payment Schedule (next 3 payments) */}
          <Card sx={{ mb: 2, border: `1px solid ${BORDER}` }}>
            <CardContent>
              <Typography variant="overline" sx={{ mb: 2, display: 'block' }}>Upcoming Payments</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Method</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {['2026-04-01', '2026-05-01', '2026-06-01'].map((date, i) => (
                    <TableRow key={date}>
                      <TableCell>{formatDate(date)}</TableCell>
                      <TableCell sx={{ color: CYAN, fontWeight: 600 }}>{formatCurrency(selectedPolicy.modalPremium)}</TableCell>
                      <TableCell><Chip label={i === 0 ? 'Upcoming' : 'Scheduled'} size="small" sx={{ bgcolor: '#1a2a4a', color: '#64B5F6', border: '1px solid #1e3a6e', fontSize: '0.65rem' }} /></TableCell>
                      <TableCell sx={{ fontSize: '0.78rem', color: TEXT_SECONDARY }}>{selectedPolicy.autoPayEnrolled ? `Auto-Draft ****${selectedPolicy.paymentMethodLast4}` : 'Manual'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card sx={{ border: `1px solid ${BORDER}` }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="overline">Payment History</Typography>
                <Button size="small" startIcon={<DownloadIcon />} sx={{ color: TEXT_SECONDARY, fontSize: '0.72rem' }}>Export</Button>
              </Box>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Receipt #</TableCell>
                    <TableCell>Payment Date</TableCell>
                    <TableCell>Period</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {MOCK_PAYMENTS.filter(p => p.policyNumber === selectedPolicy.policyNumber).map(payment => (
                    <TableRow key={payment.sys_id} hover>
                      <TableCell sx={{ fontSize: '0.75rem', color: TEXT_SECONDARY }}>{payment.receiptNumber}</TableCell>
                      <TableCell sx={{ fontSize: '0.78rem' }}>{formatDate(payment.paymentDate)}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', color: TEXT_SECONDARY }}>{payment.periodCovered}</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: CYAN }}>{formatCurrency(payment.amount)}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', color: TEXT_SECONDARY }}>ACH ****{payment.accountLast4}</TableCell>
                      <TableCell><StatusChip status={payment.status} /></TableCell>
                    </TableRow>
                  ))}
                  {MOCK_PAYMENTS.filter(p => p.policyNumber === selectedPolicy.policyNumber).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'center', color: TEXT_SECONDARY, py: 3, fontSize: '0.82rem' }}>
                        No payment history for this policy yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Statements */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="overline" sx={{ mb: 1.5, display: 'block' }}>Billing Statements</Typography>
              {MOCK_BILLING_STATEMENTS.filter(s => s.policyNumber === selectedPolicy.policyNumber).map(stmt => (
                <Box key={stmt.sys_id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: `1px solid ${BORDER}` }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }}>Statement — {formatDate(stmt.statementDate)}</Typography>
                    <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>Period: {formatDate(stmt.periodStart)} – {formatDate(stmt.periodEnd)}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: stmt.balance === 0 ? '#66BB6A' : CYAN }}>
                      {stmt.balance === 0 ? 'Paid' : formatCurrency(stmt.amountDue)}
                    </Typography>
                    <Button size="small" startIcon={<DownloadIcon />} sx={{ color: TEXT_SECONDARY, fontSize: '0.68rem', py: 0.25 }}>PDF</Button>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
