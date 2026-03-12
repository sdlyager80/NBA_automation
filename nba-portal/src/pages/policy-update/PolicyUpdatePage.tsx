import {
  Box, Card, CardContent, Typography, Grid, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Alert, Chip, Divider, Tab, Tabs,
} from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import PaymentIcon from '@mui/icons-material/Payment';
import { useState } from 'react';
import { MOCK_POLICIES } from '../../services/mock/mockData';
import PageHeader from '../../components/common/PageHeader';
import { useApp } from '../../store/AppContext';
import { BORDER, CYAN, TEXT_SECONDARY } from '../../theme/tokens';

const UPDATE_TYPES = [
  { value: 'beneficiary', label: 'Beneficiary Change', icon: <PersonIcon />, desc: 'Update primary or contingent beneficiaries' },
  { value: 'address', label: 'Address Update', icon: <HomeIcon />, desc: 'Change mailing or contact address' },
  { value: 'payment', label: 'Payment Method Change', icon: <PaymentIcon />, desc: 'Update bank account or card on file' },
];

export default function PolicyUpdatePage() {
  const { addNotification } = useApp();
  const [updateType, setUpdateType] = useState<string | null>(null);
  const [policy] = useState(MOCK_POLICIES[0]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    await new Promise(r => setTimeout(r, 1000));
    setSubmitted(true);
    addNotification('Policy update request submitted. Changes will be processed within 2 business days.', 'success');
  };

  return (
    <>
      <PageHeader
        title="Policy Update"
        subtitle="Submit policy change requests — beneficiary, address, or payment method"
      />

      {/* Policy Context */}
      <Card sx={{ mb: 3, border: `1px solid rgba(0,174,239,0.3)`, bgcolor: 'rgba(0,174,239,0.04)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="overline" sx={{ color: CYAN, display: 'block', mb: 0.5 }}>Current Policy</Typography>
              <Typography sx={{ fontWeight: 700 }}>{policy.insuredFirstName} {policy.insuredLastName} — {policy.policyNumber}</Typography>
              <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>{policy.productName} · Coverage: ${policy.faceAmount.toLocaleString()} · Status: Active</Typography>
            </Box>
            <Button variant="outlined" size="small" color="secondary" onClick={() => setUpdateType(null)}>Change Policy</Button>
          </Box>
        </CardContent>
      </Card>

      {!updateType ? (
        <Grid container spacing={2}>
          {UPDATE_TYPES.map(ut => (
            <Grid size={{ xs: 12, sm: 4 }} key={ut.value}>
              <Card
                onClick={() => setUpdateType(ut.value)}
                sx={{
                  cursor: 'pointer', border: `1px solid ${BORDER}`, textAlign: 'center', p: 2,
                  transition: 'all 0.15s',
                  '&:hover': { borderColor: CYAN, transform: 'translateY(-2px)', boxShadow: `0 4px 16px rgba(0,174,239,0.1)` },
                }}
              >
                <Box sx={{ color: CYAN, mb: 1, '& svg': { fontSize: 36 } }}>{ut.icon}</Box>
                <Typography sx={{ fontWeight: 700, mb: 0.5 }}>{ut.label}</Typography>
                <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>{ut.desc}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : submitted ? (
        <Card sx={{ border: `1px solid ${BORDER}`, textAlign: 'center', p: 4 }}>
          <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: '#0f2a15', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, fontSize: '1.5rem' }}>✅</Box>
          <Typography variant="h6" sx={{ color: '#66BB6A', fontWeight: 700 }}>Update Request Submitted</Typography>
          <Typography sx={{ color: TEXT_SECONDARY, mt: 1, mb: 3 }}>Your request has been submitted and will be processed within 2 business days. A confirmation will be sent to the insured's email.</Typography>
          <Button variant="contained" color="secondary" onClick={() => { setUpdateType(null); setSubmitted(false); }}>Make Another Change</Button>
        </Card>
      ) : (
        <Card sx={{ border: `1px solid ${BORDER}` }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="overline">{UPDATE_TYPES.find(u => u.value === updateType)?.label}</Typography>
              <Button size="small" onClick={() => setUpdateType(null)} sx={{ color: TEXT_SECONDARY }}>← Change Request Type</Button>
            </Box>

            {updateType === 'beneficiary' && (
              <Grid container spacing={2}>
                <Grid size={12}><Alert severity="info" sx={{ fontSize: '0.8rem' }}>Current primary beneficiary: <strong>Eternal Rest Funeral Home (Irrevocable Assignment)</strong>. Changing an irrevocable beneficiary requires funeral home consent.</Alert></Grid>
                <Grid size={6}><TextField fullWidth label="New Beneficiary Name *" size="small" /></Grid>
                <Grid size={6}>
                  <FormControl fullWidth size="small"><InputLabel>Relationship</InputLabel>
                    <Select defaultValue="funeral_home" label="Relationship">
                      <MenuItem value="funeral_home">Funeral Home (Irrevocable)</MenuItem>
                      <MenuItem value="spouse">Spouse</MenuItem>
                      <MenuItem value="child">Child</MenuItem>
                      <MenuItem value="estate">Estate</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={6}><TextField fullWidth label="Contingent Beneficiary" size="small" placeholder="Optional" /></Grid>
                <Grid size={12}><TextField fullWidth label="Reason for Change *" size="small" multiline rows={2} /></Grid>
              </Grid>
            )}

            {updateType === 'address' && (
              <Grid container spacing={2}>
                <Grid size={12}><Alert severity="info" sx={{ fontSize: '0.8rem' }}>Current address: <strong>4821 Oak Lawn Ave, Dallas, TX 75219</strong></Alert></Grid>
                <Grid size={12}><TextField fullWidth label="New Street Address *" size="small" /></Grid>
                <Grid size={5}><TextField fullWidth label="City *" size="small" /></Grid>
                <Grid size={3}><TextField fullWidth label="State *" size="small" /></Grid>
                <Grid size={4}><TextField fullWidth label="ZIP Code *" size="small" /></Grid>
                <Grid size={6}><TextField fullWidth label="New Phone" size="small" /></Grid>
                <Grid size={6}><TextField fullWidth label="New Email" size="small" type="email" /></Grid>
              </Grid>
            )}

            {updateType === 'payment' && (
              <Grid container spacing={2}>
                <Grid size={12}><Alert severity="warning" sx={{ fontSize: '0.8rem' }}>Current payment method: <strong>ACH — Wells Fargo ****4782 (Auto-Pay Active)</strong></Alert></Grid>
                <Grid size={6}>
                  <FormControl fullWidth size="small"><InputLabel>New Payment Method</InputLabel>
                    <Select defaultValue="ach" label="New Payment Method">
                      <MenuItem value="ach">EFT / ACH Bank Draft</MenuItem>
                      <MenuItem value="credit_card">Credit Card</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={6}><TextField fullWidth label="Account Holder Name *" size="small" /></Grid>
                <Grid size={6}><TextField fullWidth label="Routing Number *" size="small" /></Grid>
                <Grid size={6}><TextField fullWidth label="Account Number *" size="small" /></Grid>
                <Grid size={6}>
                  <FormControl fullWidth size="small"><InputLabel>Account Type</InputLabel>
                    <Select defaultValue="checking" label="Account Type">
                      <MenuItem value="checking">Checking</MenuItem>
                      <MenuItem value="savings">Savings</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={6}>
                  <FormControl fullWidth size="small"><InputLabel>Effective Date</InputLabel>
                    <Select defaultValue="next_due" label="Effective Date">
                      <MenuItem value="next_due">Next Due Date (Apr 1, 2026)</MenuItem>
                      <MenuItem value="immediate">Immediately</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}

            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
              <Button onClick={() => setUpdateType(null)} sx={{ color: TEXT_SECONDARY }}>Cancel</Button>
              <Button variant="contained" color="secondary" onClick={handleSubmit}>Submit Change Request</Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </>
  );
}
