import {
  Box, Card, CardContent, Typography, Grid, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Alert, Divider, Stepper, Step, StepLabel, Chip,
} from '@mui/material';
import { useState } from 'react';
import { MOCK_POLICIES } from '../../services/mock/mockData';
import PageHeader from '../../components/common/PageHeader';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useApp } from '../../store/AppContext';
import { BORDER, CYAN, TEXT_SECONDARY } from '../../theme/tokens';

export default function BillPayPage() {
  const { addNotification } = useApp();
  const [step, setStep] = useState(0);
  const [policyNumber, setPolicyNumber] = useState('');
  const [foundPolicy, setFoundPolicy] = useState<typeof MOCK_POLICIES[0] | null>(null);
  const [payMethod, setPayMethod] = useState('ach');
  const [submitted, setSubmitted] = useState(false);
  const [receipt, setReceipt] = useState('');

  const lookupPolicy = () => {
    const policy = MOCK_POLICIES.find(p =>
      p.policyNumber.toLowerCase().includes(policyNumber.toLowerCase()) ||
      policyNumber === 'anna' // demo shortcut
    );
    if (policy) {
      setFoundPolicy(policy);
      setStep(1);
    } else {
      addNotification('Policy not found. Try "PNP-2026-00847"', 'error');
    }
  };

  const submitPayment = async () => {
    setStep(2);
    await new Promise(r => setTimeout(r, 1500));
    const rcpt = `PAY-2026-${Date.now().toString().slice(-6)}`;
    setReceipt(rcpt);
    setSubmitted(true);
    addNotification('Payment submitted successfully!', 'success');
  };

  return (
    <>
      <PageHeader title="Bill Pay" subtitle="Submit a premium payment for an active policy" />

      <Box sx={{ maxWidth: 640, mx: 'auto' }}>
        <Stepper activeStep={step} sx={{ mb: 3 }}>
          {['Find Policy', 'Payment Details', 'Confirmation'].map(label => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        {/* Step 0: Policy Lookup */}
        {step === 0 && (
          <Card sx={{ border: `1px solid ${BORDER}` }}>
            <CardContent>
              <Typography variant="overline" sx={{ mb: 2, display: 'block' }}>Find Your Policy</Typography>
              <TextField
                fullWidth label="Policy Number or Insured Name *" size="small"
                value={policyNumber} onChange={e => setPolicyNumber(e.target.value)}
                placeholder="e.g. PNP-2026-00847"
                helperText="Demo: try 'PNP-2026-00847' or 'anna'"
                sx={{ mb: 2 }}
                onKeyDown={e => e.key === 'Enter' && lookupPolicy()}
              />
              <Button variant="contained" color="secondary" onClick={lookupPolicy} disabled={!policyNumber}>
                Find Policy →
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Payment Form */}
        {step === 1 && foundPolicy && (
          <Box>
            <Card sx={{ mb: 2, border: `1px solid rgba(0,174,239,0.3)`, bgcolor: 'rgba(0,174,239,0.04)' }}>
              <CardContent>
                <Typography variant="overline" sx={{ color: CYAN, mb: 2, display: 'block' }}>Policy Found</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                  {[
                    ['Policy #', foundPolicy.policyNumber],
                    ['Insured', `${foundPolicy.insuredFirstName} ${foundPolicy.insuredLastName}`],
                    ['Product', foundPolicy.productName],
                    ['Coverage', formatCurrency(foundPolicy.faceAmount, 0)],
                    ['Amount Due', formatCurrency(foundPolicy.modalPremium)],
                    ['Due Date', formatDate(foundPolicy.nextDueDate)],
                  ].map(([k, v]) => (
                    <Box key={k}>
                      <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>{k}</Typography>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: k === 'Coverage' || k === 'Amount Due' ? CYAN : 'inherit' }}>{v}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ mb: 2, border: `1px solid ${BORDER}` }}>
              <CardContent>
                <Typography variant="overline" sx={{ mb: 2, display: 'block' }}>Payment Details</Typography>
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Payment Method</InputLabel>
                      <Select value={payMethod} label="Payment Method" onChange={e => setPayMethod(e.target.value)}>
                        <MenuItem value="ach">EFT / ACH Bank Draft</MenuItem>
                        <MenuItem value="credit_card">Credit Card</MenuItem>
                        <MenuItem value="debit_card">Debit Card</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={6}>
                    <TextField fullWidth label="Amount" size="small" defaultValue={foundPolicy.modalPremium.toFixed(2)} InputProps={{ startAdornment: <Typography sx={{ mr: 0.5, color: TEXT_SECONDARY }}>$</Typography> }} />
                  </Grid>

                  {payMethod === 'ach' && (
                    <>
                      <Grid size={6}><TextField fullWidth label="Routing Number" size="small" defaultValue="111000025" /></Grid>
                      <Grid size={6}><TextField fullWidth label="Account Number" size="small" defaultValue="****4782" /></Grid>
                    </>
                  )}
                  {(payMethod === 'credit_card' || payMethod === 'debit_card') && (
                    <>
                      <Grid size={8}><TextField fullWidth label="Card Number" size="small" placeholder="•••• •••• •••• ••••" /></Grid>
                      <Grid size={4}><TextField fullWidth label="CVV" size="small" placeholder="•••" /></Grid>
                      <Grid size={6}><TextField fullWidth label="Expiration" size="small" placeholder="MM/YY" /></Grid>
                      <Grid size={6}><TextField fullWidth label="Billing ZIP" size="small" /></Grid>
                    </>
                  )}

                  <Grid size={12}>
                    <TextField fullWidth label="Payment Notes (optional)" size="small" multiline rows={2} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
              <Button onClick={() => setStep(0)}>← Back</Button>
              <Button variant="contained" color="secondary" onClick={submitPayment}>Submit Payment →</Button>
            </Box>
          </Box>
        )}

        {/* Step 2: Processing/Confirmation */}
        {step === 2 && (
          <Card sx={{ border: `1px solid ${BORDER}`, textAlign: 'center', p: 4 }}>
            {!submitted ? (
              <>
                <Typography sx={{ fontSize: '2rem', mb: 2 }}>⏳</Typography>
                <Typography variant="h6">Processing Payment...</Typography>
              </>
            ) : (
              <>
                <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: '#0f2a15', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, fontSize: '1.5rem' }}>✅</Box>
                <Typography variant="h5" sx={{ color: '#66BB6A', fontWeight: 700 }}>Payment Submitted!</Typography>
                <Typography sx={{ color: TEXT_SECONDARY, mt: 1, mb: 3 }}>Your payment has been processed successfully.</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, maxWidth: 360, mx: 'auto', textAlign: 'left', p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1.5, mb: 3 }}>
                  {[
                    ['Receipt #', receipt],
                    ['Policy #', foundPolicy?.policyNumber ?? ''],
                    ['Amount', formatCurrency(foundPolicy?.modalPremium ?? 0)],
                    ['Date', new Date().toLocaleDateString()],
                  ].map(([k, v]) => (
                    <>
                      <Typography key={`k-${k}`} sx={{ fontSize: '0.78rem', color: TEXT_SECONDARY }}>{k}</Typography>
                      <Typography key={`v-${k}`} sx={{ fontSize: '0.82rem', fontWeight: 600 }}>{v}</Typography>
                    </>
                  ))}
                </Box>
                <Alert severity="info" sx={{ mb: 2, textAlign: 'left', fontSize: '0.8rem' }}>
                  A payment confirmation has been sent to the insured's email address on file.
                </Alert>
                <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
                  <Button variant="contained" color="secondary" onClick={() => { setStep(0); setPolicyNumber(''); setFoundPolicy(null); setSubmitted(false); }}>
                    Make Another Payment
                  </Button>
                  <Button variant="outlined" sx={{ color: TEXT_SECONDARY }}>View Billing History</Button>
                </Box>
              </>
            )}
          </Card>
        )}
      </Box>
    </>
  );
}
