import {
  Box, Card, CardContent, Typography, Grid, Table, TableBody, TableCell,
  TableHead, TableRow, Button, Chip, TextField, InputAdornment, FormControl,
  InputLabel, Select, MenuItem, Alert, LinearProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SyncIcon from '@mui/icons-material/Sync';
import { useState } from 'react';
import { MOCK_DATA_INTEGRITY } from '../../services/mock/mockData';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { formatDate } from '../../utils/formatters';
import { useApp } from '../../store/AppContext';
import { BORDER, CYAN, TEXT_SECONDARY } from '../../theme/tokens';
import type { DataIntegrityRecord } from '../../types/billing.types';

const SEVERITY_COLORS = {
  critical: { bg: '#4a1a1a', text: '#EF5350', border: '#EF5350' },
  warning:  { bg: '#2a2010', text: '#FFB74D', border: '#FFB74D' },
  info:     { bg: '#1a2a4a', text: '#64B5F6', border: '#1e3a6e' },
};

export default function DataIntegrityPage() {
  const { addNotification } = useApp();
  const [records, setRecords] = useState<DataIntegrityRecord[]>(MOCK_DATA_INTEGRITY);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [syncing, setSyncing] = useState(false);

  const runSync = async () => {
    setSyncing(true);
    await new Promise(r => setTimeout(r, 2000));
    setSyncing(false);
    addNotification('Data integrity sync completed. 4 records validated.', 'success');
  };

  const resolveRecord = (id: string) => {
    setRecords(prev => prev.map(r => r.sys_id === id ? { ...r, status: 'resolved' as const, resolvedAt: new Date().toISOString(), resolvedBy: 'Marcus Webb' } : r));
    addNotification('Record marked as resolved.', 'success');
  };

  const filtered = records.filter(r => {
    const matchSearch = !search || r.recordId.toLowerCase().includes(search.toLowerCase()) || r.errorMessage.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severityFilter === 'all' || r.severity === severityFilter;
    return matchSearch && matchSeverity;
  });

  const criticalCount = records.filter(r => r.severity === 'critical' && r.status === 'open').length;
  const warningCount = records.filter(r => r.severity === 'warning' && r.status === 'open').length;
  const resolvedCount = records.filter(r => r.status === 'resolved').length;

  return (
    <>
      <PageHeader
        title="Data Integrity"
        subtitle="Validation dashboard, error queue, and reconciliation tools"
        actions={
          <Button variant="contained" color="secondary" startIcon={<SyncIcon />} onClick={runSync} disabled={syncing}>
            {syncing ? 'Syncing...' : 'Run Sync'}
          </Button>
        }
      />

      {syncing && <LinearProgress color="secondary" sx={{ mb: 2, borderRadius: 1 }} />}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="Total Records Checked" value={2847} color={CYAN} /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="Critical Errors" value={criticalCount} color="#EF5350" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="Warnings" value={warningCount} color="#FFB74D" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><StatCard label="Resolved Today" value={resolvedCount} color="#66BB6A" /></Grid>
      </Grid>

      <Card sx={{ mb: 2, border: `1px solid ${BORDER}` }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search errors..." size="small"
              value={search} onChange={e => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: TEXT_SECONDARY }} /></InputAdornment> }}
              sx={{ width: 260 }}
            />
            <FormControl size="small" sx={{ width: 140 }}>
              <InputLabel>Severity</InputLabel>
              <Select value={severityFilter} label="Severity" onChange={e => setSeverityFilter(e.target.value)}>
                <MenuItem value="all">All Severities</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="info">Info</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Record Type</TableCell>
                <TableCell>Record ID</TableCell>
                <TableCell>Error Code</TableCell>
                <TableCell>Error Message</TableCell>
                <TableCell>Affected Field</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(record => {
                const sev = SEVERITY_COLORS[record.severity];
                return (
                  <TableRow key={record.sys_id} hover>
                    <TableCell><Chip label={record.recordType} size="small" sx={{ bgcolor: 'rgba(0,0,0,0.3)', fontSize: '0.65rem', textTransform: 'capitalize' }} /></TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', color: TEXT_SECONDARY, fontFamily: 'monospace' }}>{record.recordId}</TableCell>
                    <TableCell sx={{ fontSize: '0.72rem', color: CYAN, fontFamily: 'monospace' }}>{record.errorCode}</TableCell>
                    <TableCell sx={{ fontSize: '0.78rem', maxWidth: 200 }}>{record.errorMessage}</TableCell>
                    <TableCell sx={{ fontSize: '0.7rem', color: TEXT_SECONDARY, fontFamily: 'monospace' }}>{record.affectedField}</TableCell>
                    <TableCell><Chip label={record.severity} size="small" sx={{ bgcolor: sev.bg, color: sev.text, border: `1px solid ${sev.border}`, fontSize: '0.65rem', fontWeight: 700 }} /></TableCell>
                    <TableCell>
                      {record.status === 'resolved'
                        ? <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><CheckCircleIcon sx={{ fontSize: 14, color: '#66BB6A' }} /><Typography sx={{ fontSize: '0.72rem', color: '#66BB6A' }}>Resolved</Typography></Box>
                        : <Chip label="Open" size="small" sx={{ bgcolor: '#2a2010', color: '#FFB74D', border: '1px solid #FFB74D', fontSize: '0.65rem' }} />
                      }
                    </TableCell>
                    <TableCell>
                      {record.status === 'open' && (
                        <Button size="small" sx={{ color: CYAN, fontSize: '0.7rem', py: 0.25 }} onClick={() => resolveRecord(record.sys_id)}>Resolve</Button>
                      )}
                      {record.status === 'resolved' && (
                        <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>by {record.resolvedBy}</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reconciliation Tools */}
      <Card sx={{ border: `1px solid ${BORDER}` }}>
        <CardContent>
          <Typography variant="overline" sx={{ mb: 2, display: 'block' }}>Reconciliation Tools</Typography>
          <Alert severity="info" sx={{ mb: 2, fontSize: '0.8rem' }}>
            Run a reconciliation between ServiceNow and external systems (Ingenium, Mendix) to identify discrepancies.
          </Alert>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={4}><TextField fullWidth label="From Date" type="date" size="small" InputLabelProps={{ shrink: true }} defaultValue="2026-03-01" /></Grid>
            <Grid size={4}><TextField fullWidth label="To Date" type="date" size="small" InputLabelProps={{ shrink: true }} defaultValue="2026-03-12" /></Grid>
            <Grid size={4}>
              <FormControl fullWidth size="small">
                <InputLabel>System</InputLabel>
                <Select defaultValue="ingenium" label="System">
                  <MenuItem value="ingenium">Ingenium Policy Admin</MenuItem>
                  <MenuItem value="mendix">Mendix Workflow</MenuItem>
                  <MenuItem value="all">All Systems</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button variant="outlined" color="secondary" onClick={() => addNotification('Reconciliation report generated. No discrepancies found.', 'success')}>
            Run Reconciliation Report
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
