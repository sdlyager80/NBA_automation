import {
  Box, Card, CardContent, Typography, Grid, Button,
  Divider, LinearProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState } from 'react';
import { useApplication } from '../../../store/ApplicationContext';
import { useApp } from '../../../store/AppContext';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { snClient } from '../../../services/servicenow';
import { BORDER, CYAN, TEXT_SECONDARY } from '../../../theme/tokens';

interface Props { onBack: () => void; }

const PROCESSING_STEPS = [
  'Encrypting and transmitting application data...',
  'Validating required fields and agent credentials...',
  'Checking NIPR state appointment (TX)...',
  'Running product eligibility and pricing validation...',
  'Creating case in ServiceNow workflow system...',
  'Generating case notes for downstream systems...',
];

const VALIDATIONS = [
  { label: 'All required fields complete', ok: true },
  { label: 'Agent appointment valid — TX License #TX-AG-28471', ok: true },
  { label: 'Product eligibility confirmed for selected funeral home', ok: true },
  { label: 'Payment method validated — ACH account active', ok: true },
  { label: 'Beneficiary designation complete — Irrevocable assignment', ok: true },
  { label: 'TX state-specific disclosure requirements met', ok: true },
  { label: 'Replacement questions answered — No replacement', ok: true },
];

export default function Step5ReviewSubmit({ onBack }: Props) {
  const { step1, step2, step3, paymentSetup, signatureData, setSignatureData, setSubmittedCaseNumber, setCurrentStep } = useApplication();
  const { addNotification } = useApp();
  const [sigMode, setSigMode] = useState<'portal' | 'docusign'>('portal');
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(-1);
  const [done, setDone] = useState(false);
  const [caseNumber, setCaseNumber] = useState('');

  const handleSubmit = async () => {
    setProcessing(true);
    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      setProcessingStep(i);
      await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
    }
    // Create record
    const result = await snClient.createRecord('x_preneed_application', {
      status: 'submitted',
      agentId: 'AGT-0042',
      agentName: 'Susan Mitchell',
      funeralHome: step1.funeralHome,
      productId: step1.product?.sys_id,
      productName: step1.product?.name,
      faceAmount: step2.faceAmount,
      modalPremium: step2.modalPremium,
      paymentMode: step1.paymentMode,
      submittedAt: new Date().toISOString(),
    });
    const cn = (result.result as { caseNumber?: string }).caseNumber ?? 'NB-2026-0001';
    setCaseNumber(cn);
    setSubmittedCaseNumber(cn);
    setProcessing(false);
    setDone(true);
    addNotification(`Application ${cn} submitted successfully!`, 'success');
  };

  if (done) {
    return (
      <Card sx={{ textAlign: 'center', p: 4 }}>
        <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: '#0f2a15', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, fontSize: '1.5rem' }}>✅</Box>
        <Typography variant="h5" sx={{ color: '#66BB6A', fontWeight: 700 }}>Application Submitted Successfully</Typography>
        <Typography sx={{ color: TEXT_SECONDARY, mt: 1, mb: 3 }}>The application has passed automated validation and is now in processing.</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', maxWidth: 360, mx: 'auto', textAlign: 'left', mb: 3, p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1.5 }}>
          {[
            ['Application #', caseNumber],
            ['Submitted', formatDate(new Date().toISOString())],
            ['Status', 'In Automated Review'],
            ['Applicant', `${step3.insured.firstName ?? ''} ${step3.insured.lastName ?? ''}`],
            ['Coverage', formatCurrency(step2.faceAmount)],
            ['Est. Issuance', '1–3 business days'],
          ].map(([k, v]) => (
            <>
              <Typography key={`k-${k}`} sx={{ fontSize: '0.78rem', color: TEXT_SECONDARY }}>{k}</Typography>
              <Typography key={`v-${k}`} sx={{ fontSize: '0.82rem', fontWeight: 600, color: k === 'Coverage' ? CYAN : 'inherit' }}>{v}</Typography>
            </>
          ))}
        </Box>
        <Typography sx={{ fontSize: '0.8rem', color: TEXT_SECONDARY, mb: 2 }}>
          <strong>What happens next:</strong> Automated validation → NIPR check → Underwriting → Issuance → Customer payment setup
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
          <Button variant="contained" color="secondary" href="/">Go to Dashboard</Button>
          <Button variant="outlined" color="secondary" onClick={() => { setDone(false); setProcessingStep(-1); setCurrentStep(0); }}>Start Another Application</Button>
        </Box>
      </Card>
    );
  }

  if (processing) {
    return (
      <Card sx={{ maxWidth: 560, mx: 'auto', p: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Submitting Application...</Typography>
        <Typography sx={{ color: TEXT_SECONDARY, mb: 3, fontSize: '0.85rem' }}>Please wait while we validate and process the submission.</Typography>
        <LinearProgress color="secondary" sx={{ mb: 3, borderRadius: 1 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, textAlign: 'left' }}>
          {PROCESSING_STEPS.map((step, i) => (
            <Box key={i} sx={{
              display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 1.5,
              opacity: i > processingStep ? 0.3 : 1,
              bgcolor: i === processingStep ? 'rgba(0,174,239,0.08)' : i < processingStep ? 'rgba(76,175,80,0.08)' : 'transparent',
              transition: 'all 0.3s',
            }}>
              <Box sx={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
                bgcolor: i < processingStep ? '#4CAF50' : i === processingStep ? CYAN : 'rgba(255,255,255,0.1)',
                color: i <= processingStep ? '#0a1520' : TEXT_SECONDARY,
              }}>
                {i < processingStep ? '✓' : i + 1}
              </Box>
              <Typography sx={{ fontSize: '0.82rem', color: i === processingStep ? CYAN : i < processingStep ? '#66BB6A' : TEXT_SECONDARY, fontWeight: i === processingStep ? 600 : 400 }}>
                {step}
              </Typography>
            </Box>
          ))}
        </Box>
      </Card>
    );
  }

  return (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="overline" sx={{ mb: 2, display: 'block' }}>Application Review Summary</Typography>
          <Box sx={{ bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1.5, p: 2, mb: 2 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" sx={{ color: TEXT_SECONDARY, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, display: 'block', mb: 0.5 }}>Applicant</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>{step3.insured.firstName} {step3.insured.lastName}</Typography>
                <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>DOB: June 15, 1958 (age 67) · Female</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" sx={{ color: TEXT_SECONDARY, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, display: 'block', mb: 0.5 }}>Funeral Home</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>{step1.funeralHome?.name}</Typography>
                <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>Agent: Susan Mitchell · #TX-AG-28471</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" sx={{ color: TEXT_SECONDARY, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, display: 'block', mb: 0.5 }}>Product & Plan</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>{step1.product?.name}</Typography>
                <Typography sx={{ color: CYAN, fontWeight: 800, fontSize: '1rem' }}>{formatCurrency(step2.faceAmount)}</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" sx={{ color: TEXT_SECONDARY, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, display: 'block', mb: 0.5 }}>Payment</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Monthly Installment — EFT/ACH</Typography>
                <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>{formatCurrency(step2.modalPremium)}/mo × 60 months</Typography>
              </Grid>
            </Grid>
          </Box>

          <Typography variant="overline" sx={{ mb: 1.5, display: 'block' }}>Pre-Submission Validation</Typography>
          {VALIDATIONS.map((v, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.75, borderBottom: i < VALIDATIONS.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
              <CheckCircleIcon sx={{ color: '#66BB6A', fontSize: 18, flexShrink: 0 }} />
              <Typography sx={{ fontSize: '0.85rem' }}>{v.label}</Typography>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <Typography variant="overline" sx={{ mb: 1.5, display: 'block' }}>Signature Capture</Typography>
          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            {[
              { value: 'portal', label: '✍️ Sign in Portal', desc: 'Digital signature captured now' },
              { value: 'docusign', label: '📄 Route to DocuSign', desc: "Send to applicant's email for e-signature" },
            ].map(opt => (
              <Grid size={6} key={opt.value}>
                <Box
                  onClick={() => setSigMode(opt.value as 'portal' | 'docusign')}
                  sx={{
                    border: `2px solid ${sigMode === opt.value ? CYAN : BORDER}`,
                    borderRadius: 1.5, p: 1.5, cursor: 'pointer',
                    bgcolor: sigMode === opt.value ? 'rgba(0,174,239,0.06)' : 'transparent',
                    transition: 'all 0.12s', '&:hover': { borderColor: CYAN },
                  }}
                >
                  <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{opt.label}</Typography>
                  <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>{opt.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {sigMode === 'portal' && (
            <Box sx={{ border: `2px dashed ${BORDER}`, borderRadius: 1.5, p: 3, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.1)' }}>
              <Typography sx={{ fontSize: '1.75rem', fontStyle: 'italic', color: CYAN, fontWeight: 300, fontFamily: '"Brush Script MT", cursive, serif' }}>
                Anna Rodriguez
              </Typography>
              <Typography variant="caption" sx={{ color: TEXT_SECONDARY, mt: 0.5, display: 'block' }}>
                Digital Signature Captured — {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack}>← Back</Button>
        <Button variant="contained" color="secondary" size="large" onClick={handleSubmit} sx={{ px: 4, bgcolor: '#4CAF50', '&:hover': { bgcolor: '#388E3C' }, color: '#fff' }}>
          ✓ Submit Application
        </Button>
      </Box>
    </Box>
  );
}
