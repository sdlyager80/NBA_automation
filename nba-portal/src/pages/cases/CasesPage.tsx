import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableHead, TableRow, TextField, FormControl, InputLabel, Select, MenuItem,
  Button, Chip, Avatar, InputAdornment, Dialog, DialogContent, DialogTitle,
  IconButton, Tab, Tabs, Alert, Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_APPLICATIONS } from '../../services/mock/mockData';
import StatusChip from '../../components/common/StatusChip';
import PageHeader from '../../components/common/PageHeader';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { BORDER, CYAN, TEXT_SECONDARY, NAVY_DARK } from '../../theme/tokens';
import { APPLICATION_STATUS_LABELS, type ApplicationStatus } from '../../types/application.types';
import { useAuth } from '../../store/AuthContext';

const CASE_TIMELINE = [
  { status: 'done', label: 'Application Submitted', detail: 'Submitted by Susan Mitchell from Eternal Rest Funeral Home portal', time: 'Mar 10, 2026 · 11:38 AM' },
  { status: 'done', label: 'Automated Validation Passed', detail: '47/47 required fields, agent credentials, product eligibility, payment — all validated.', time: 'Mar 10, 2026 · 11:40 AM' },
  { status: 'done', label: 'NIPR Appointment Verified — TX', detail: 'State appointment confirmed for Agent Susan Mitchell #TX-AG-28471', time: 'Mar 10, 2026 · 11:42 AM' },
  { status: 'done', label: 'Case Marked In Good Order (IGO)', detail: 'All validations passed. Auto-generated case notes pushed to ServiceNow.', time: 'Mar 10, 2026 · 11:45 AM' },
  { status: 'done', label: 'Policy Issued — Approved – Active', detail: 'Policy #PNP-2026-00847 issued. Fulfillment triggered for policy print.', time: 'Mar 10, 2026 · 2:12 PM' },
  { status: 'done', label: 'Policy Print Emailed', detail: 'Delivery receipt confirmed by both parties via e-signature', time: 'Mar 10, 2026 · 4:30 PM' },
  { status: 'done', label: 'Customer Payment Setup Completed', detail: 'Auto-pay enrolled — Monthly EFT/ACH — Wells Fargo ****4782', time: 'Mar 12, 2026 · 3:15 PM' },
];

export default function CasesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState<typeof MOCK_APPLICATIONS[0] | null>(null);
  const [detailTab, setDetailTab] = useState(0);

  // For agents, show only their cases
  const allApps = user.role === 'agent'
    ? MOCK_APPLICATIONS.filter(a => a.agentId === user.agentId)
    : MOCK_APPLICATIONS;

  const filtered = allApps.filter(app => {
    const matchSearch = !search ||
      `${app.insured.firstName} ${app.insured.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      app.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
      (app.policyNumber ?? '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const isAgent = user.role === 'agent';

  return (
    <>
      <PageHeader
        title={isAgent ? 'My Cases' : 'All Cases'}
        subtitle={isAgent ? `Showing cases for Agent ${user.agentId}` : 'New Business Application Queue'}
        actions={
          isAgent && (
            <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => navigate('/applications/new')}>
              New Application
            </Button>
          )
        }
      />

      <Card sx={{ border: `1px solid ${BORDER}` }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search by name, Case ID, or policy #..."
              size="small"
              value={search}
              onChange={e => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: TEXT_SECONDARY }} /></InputAdornment> }}
              sx={{ width: 280 }}
            />
            <FormControl size="small" sx={{ width: 160 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={e => setStatusFilter(e.target.value)}>
                <MenuItem value="all">All Statuses</MenuItem>
                {Object.entries(APPLICATION_STATUS_LABELS).map(([k, v]) => (
                  <MenuItem key={k} value={k}>{v}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="caption" sx={{ color: TEXT_SECONDARY, alignSelf: 'center', ml: 'auto' }}>
              {filtered.length} of {allApps.length} cases
            </Typography>
          </Box>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Applicant</TableCell>
                <TableCell>Case ID</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Coverage</TableCell>
                <TableCell>Funeral Home</TableCell>
                {!isAgent && <TableCell>Agent</TableCell>}
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(app => (
                <TableRow key={app.sys_id} onClick={() => setSelectedApp(app)} hover sx={{ cursor: 'pointer' }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 26, height: 26, bgcolor: '#1a2a4a', fontSize: '0.65rem', fontWeight: 700 }}>
                        {app.insured.firstName[0]}{app.insured.lastName[0]}
                      </Avatar>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }}>{app.insured.firstName} {app.insured.lastName}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: TEXT_SECONDARY, fontSize: '0.78rem' }}>{app.caseNumber}</TableCell>
                  <TableCell sx={{ fontSize: '0.78rem' }}>{app.productName}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: CYAN, fontSize: '0.82rem' }}>{formatCurrency(app.faceAmount, 0)}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: TEXT_SECONDARY, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.funeralHome.name}</TableCell>
                  {!isAgent && <TableCell sx={{ fontSize: '0.75rem', color: TEXT_SECONDARY }}>{app.agentName}</TableCell>}
                  <TableCell><StatusChip status={app.status} /></TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', color: TEXT_SECONDARY }}>{formatDate(app.submittedAt ?? app.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Case Detail Dialog */}
      <Dialog open={!!selectedApp} onClose={() => setSelectedApp(null)} maxWidth="md" fullWidth>
        {selectedApp && (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
              <Box>
                <Typography variant="h6">{selectedApp.insured.firstName} {selectedApp.insured.lastName}</Typography>
                <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>{selectedApp.caseNumber} · {selectedApp.policyNumber ?? 'Policy pending issuance'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StatusChip status={selectedApp.status} />
                <IconButton size="small" onClick={() => setSelectedApp(null)}><CloseIcon /></IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Tabs value={detailTab} onChange={(_, v) => setDetailTab(v)} sx={{ mb: 2 }}>
                <Tab label="Summary" />
                <Tab label="Timeline" />
                <Tab label="Documents" />
                <Tab label="Payment" />
              </Tabs>

              {detailTab === 0 && (
                <Box sx={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '6px 16px', fontSize: '0.85rem' }}>
                  {[
                    ['Coverage', formatCurrency(selectedApp.faceAmount)],
                    ['Product', selectedApp.productName],
                    ['Package', selectedApp.packageType.replace('_', ' ')],
                    ['Funeral Home', selectedApp.funeralHome.name],
                    ['Agent', `${selectedApp.agentName} · #TX-AG-28471`],
                    ['Payment Mode', selectedApp.paymentMode.replace('_', ' ')],
                    ['Modal Premium', formatCurrency(selectedApp.modalPremium) + '/mo'],
                    ['Submitted', formatDate(selectedApp.submittedAt ?? selectedApp.createdAt)],
                    selectedApp.nigoReason ? ['NIGO Reason', selectedApp.nigoReason] : null,
                  ].filter((x): x is string[] => x !== null).map(([k, v]) => (
                    <>
                      <Typography key={`k-${k}`} sx={{ fontSize: '0.78rem', color: TEXT_SECONDARY, fontWeight: 500 }}>{k}</Typography>
                      <Typography key={`v-${k}`} sx={{ fontSize: '0.82rem', fontWeight: 600, color: k === 'Coverage' ? CYAN : 'inherit' }}>{v}</Typography>
                    </>
                  ))}
                </Box>
              )}

              {detailTab === 1 && (
                <Box sx={{ position: 'relative', pl: 4 }}>
                  <Box sx={{ position: 'absolute', left: 12, top: 8, bottom: 8, width: 2, bgcolor: BORDER }} />
                  {CASE_TIMELINE.map((item, i) => (
                    <Box key={i} sx={{ mb: 2, position: 'relative' }}>
                      <Box sx={{ position: 'absolute', left: -32, top: 2, width: 22, height: 22, borderRadius: '50%', bgcolor: '#0f2a15', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#66BB6A', fontWeight: 700 }}>✓</Box>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.label}</Typography>
                      <Typography variant="caption" sx={{ color: TEXT_SECONDARY, display: 'block', lineHeight: 1.4 }}>{item.detail}</Typography>
                      <Typography variant="caption" sx={{ color: TEXT_SECONDARY, opacity: 0.7, mt: 0.25, display: 'block' }}>{item.time}</Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {detailTab === 2 && (
                <Box>
                  {[
                    'Signed Application — ' + selectedApp.caseNumber,
                    'Goods & Services Agreement',
                    'Payment Authorization Form',
                    selectedApp.policyNumber ? 'Policy Print — ' + selectedApp.policyNumber : null,
                    'Delivery Receipt (e-signed)',
                  ].filter(Boolean).map(doc => (
                    <Box key={doc} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.25, borderBottom: `1px solid ${BORDER}` }}>
                      <Typography sx={{ fontSize: '0.82rem' }}>📄 {doc}</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" sx={{ color: CYAN, fontSize: '0.72rem', py: 0.25 }}>View</Button>
                        <Button size="small" sx={{ color: TEXT_SECONDARY, fontSize: '0.72rem', py: 0.25 }}>Download</Button>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}

              {detailTab === 3 && (
                <Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '6px 16px', mb: 2 }}>
                    {[
                      ['Plan', `${selectedApp.paymentMode.replace('_', ' ')} — ${formatCurrency(selectedApp.modalPremium)}/mo × 60`],
                      ['Method', selectedApp.paymentSetup.mode === 'enter_now' ? `EFT/ACH — Wells Fargo ****4782` : selectedApp.paymentSetup.mode === 'send_later' ? 'Payment link sent' : 'Customer self-service'],
                      ['First Draft', 'April 1, 2026'],
                      ['Total Premium', formatCurrency(selectedApp.modalPremium * 60)],
                    ].map(([k, v]) => (
                      <>
                        <Typography key={`k-${k}`} sx={{ fontSize: '0.78rem', color: TEXT_SECONDARY }}>{k}</Typography>
                        <Typography key={`v-${k}`} sx={{ fontSize: '0.82rem', fontWeight: 600 }}>{v}</Typography>
                      </>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" color="secondary" size="small">📨 Send Payment Reminder</Button>
                    <Button variant="outlined" size="small" sx={{ color: TEXT_SECONDARY }}>💳 Enter Payment Directly</Button>
                  </Box>
                </Box>
              )}

              {selectedApp.status === 'nigo' && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', mb: 0.5 }}>NIGO — Action Required</Typography>
                  <Typography sx={{ fontSize: '0.8rem' }}>{selectedApp.nigoReason}</Typography>
                  <Button size="small" variant="contained" color="warning" sx={{ mt: 1 }}>Correct & Resubmit</Button>
                </Alert>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
}
