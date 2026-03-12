import {
  Box, Card, CardContent, Typography, Grid, TextField, Tab, Tabs,
  FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel,
  Button, Alert, Divider, Chip, IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useState } from 'react';
import { useApplication } from '../../../store/ApplicationContext';
import { BORDER, CYAN, TEXT_SECONDARY } from '../../../theme/tokens';
import type { Beneficiary } from '../../../types/application.types';

interface Props { onNext: () => void; onBack: () => void; }

function genId() { return `b-${Date.now()}`; }

export default function Step3ApplicantDetails({ onNext, onBack }: Props) {
  const { step3, setStep3 } = useApplication();
  const [tab, setTab] = useState(0);
  const [insured, setInsured] = useState(step3.insured);
  const [ownerSame, setOwnerSame] = useState(step3.ownerPayor.sameAsInsured);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(
    step3.beneficiaries.length ? step3.beneficiaries : [
      { id: genId(), type: 'primary', firstName: '', lastName: 'Funeral Home', relationship: 'Funeral Home (Irrevocable)', percentage: 100 },
    ]
  );
  const [disclosures, setDisclosures] = useState(step3.disclosuresAcknowledged);
  const [rep1, setRep1] = useState(false);
  const [rep2, setRep2] = useState(false);

  const save = () => {
    setStep3({
      insured,
      ownerPayor: { sameAsInsured: ownerSame },
      beneficiaries,
      disclosuresAcknowledged: disclosures,
      replacementAnswers: { question1: rep1, question2: rep2 },
    });
  };

  const addBeneficiary = (type: 'primary' | 'contingent') => {
    setBeneficiaries(prev => [...prev, { id: genId(), type, firstName: '', lastName: '', relationship: '', percentage: 0 }]);
  };

  const updateBeneficiary = (id: string, field: keyof Beneficiary, value: string | number) => {
    setBeneficiaries(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const removeBeneficiary = (id: string) => setBeneficiaries(prev => prev.filter(b => b.id !== id));

  const primaryBenefs = beneficiaries.filter(b => b.type === 'primary');
  const contingentBenefs = beneficiaries.filter(b => b.type === 'contingent');
  const primaryTotal = primaryBenefs.reduce((sum, b) => sum + Number(b.percentage), 0);

  return (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab label="Applicant (Insured)" />
            <Tab label="Owner / Payor" />
            <Tab label="Beneficiary" />
            <Tab label="Disclosures" />
          </Tabs>

          {/* TAB 0: Insured */}
          {tab === 0 && (
            <Box>
              <Grid container spacing={2}>
                <Grid size={6}><TextField fullWidth label="First Name *" size="small" defaultValue="Anna" /></Grid>
                <Grid size={6}><TextField fullWidth label="Last Name *" size="small" defaultValue="Rodriguez" /></Grid>
                <Grid size={4}><TextField fullWidth label="SSN *" size="small" defaultValue="***-**-4821" /></Grid>
                <Grid size={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Gender</InputLabel>
                    <Select defaultValue="F" label="Gender">
                      <MenuItem value="F">Female</MenuItem>
                      <MenuItem value="M">Male</MenuItem>
                      <MenuItem value="N">Non-Binary</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Marital Status</InputLabel>
                    <Select defaultValue="widowed" label="Marital Status">
                      <MenuItem value="single">Single</MenuItem>
                      <MenuItem value="married">Married</MenuItem>
                      <MenuItem value="divorced">Divorced</MenuItem>
                      <MenuItem value="widowed">Widowed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={6}><TextField fullWidth label="Address *" size="small" defaultValue="4821 Oak Lawn Ave, Dallas, TX 75219" /></Grid>
                <Grid size={6}><TextField fullWidth label="Date of Birth *" type="date" size="small" InputLabelProps={{ shrink: true }} defaultValue="1958-06-15" /></Grid>
                <Grid size={6}><TextField fullWidth label="Phone *" size="small" defaultValue="(214) 555-0183" /></Grid>
                <Grid size={6}><TextField fullWidth label="Email *" size="small" defaultValue="anna.rodriguez@email.com" /></Grid>
              </Grid>
            </Box>
          )}

          {/* TAB 1: Owner/Payor */}
          {tab === 1 && (
            <Box>
              <Alert severity="info" sx={{ mb: 2, fontSize: '0.8rem' }}>
                If the owner/payor is the same as the insured applicant, information is auto-populated.
              </Alert>
              <FormControlLabel
                control={<Checkbox checked={ownerSame} onChange={e => setOwnerSame(e.target.checked)} sx={{ color: CYAN }} />}
                label={<Typography sx={{ fontSize: '0.85rem' }}>Owner/Payor is the same as insured applicant</Typography>}
                sx={{ mb: 2 }}
              />
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid size={6}><TextField fullWidth label="Owner Name" size="small" value={ownerSame ? 'Anna Rodriguez' : ''} disabled={ownerSame} /></Grid>
                <Grid size={6}><TextField fullWidth label="Relationship" size="small" value={ownerSame ? 'Self' : ''} disabled={ownerSame} /></Grid>
              </Grid>
            </Box>
          )}

          {/* TAB 2: Beneficiary */}
          {tab === 2 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2">Primary Beneficiaries</Typography>
                {primaryTotal !== 100 && primaryBenefs.length > 0 && (
                  <Chip label={`${primaryTotal}% — must total 100%`} size="small" sx={{ bgcolor: '#4a1a1a', color: '#EF5350', border: '1px solid #EF5350', fontSize: '0.65rem' }} />
                )}
                {primaryTotal === 100 && (
                  <Chip label="100% ✓" size="small" sx={{ bgcolor: '#0f2a15', color: '#66BB6A', border: '1px solid #1a4a22', fontSize: '0.65rem' }} />
                )}
              </Box>

              {primaryBenefs.map(b => (
                <Box key={b.id} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 80px 36px', gap: 1.5, mb: 1.5, alignItems: 'flex-start' }}>
                  <TextField label="First Name *" size="small" value={b.firstName} onChange={e => updateBeneficiary(b.id, 'firstName', e.target.value)} />
                  <TextField label="Last Name *" size="small" value={b.lastName} onChange={e => updateBeneficiary(b.id, 'lastName', e.target.value)} />
                  <FormControl size="small">
                    <InputLabel>Relationship</InputLabel>
                    <Select value={b.relationship} label="Relationship" onChange={e => updateBeneficiary(b.id, 'relationship', e.target.value)}>
                      <MenuItem value="Funeral Home (Irrevocable)">Funeral Home (Irrevocable)</MenuItem>
                      <MenuItem value="Spouse">Spouse</MenuItem>
                      <MenuItem value="Child">Child</MenuItem>
                      <MenuItem value="Estate">Estate</MenuItem>
                      <MenuItem value="Trust">Trust</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField label="%" size="small" type="number" value={b.percentage} onChange={e => updateBeneficiary(b.id, 'percentage', Number(e.target.value))} />
                  <IconButton size="small" onClick={() => removeBeneficiary(b.id)} sx={{ mt: 0.5, color: TEXT_SECONDARY, '&:hover': { color: '#EF5350' } }}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              <Button size="small" startIcon={<AddIcon />} onClick={() => addBeneficiary('primary')} sx={{ color: CYAN, mb: 3 }}>Add Primary Beneficiary</Button>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Contingent Beneficiaries (Optional)</Typography>
              {contingentBenefs.map(b => (
                <Box key={b.id} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 80px 36px', gap: 1.5, mb: 1.5 }}>
                  <TextField label="First Name" size="small" value={b.firstName} onChange={e => updateBeneficiary(b.id, 'firstName', e.target.value)} />
                  <TextField label="Last Name" size="small" value={b.lastName} onChange={e => updateBeneficiary(b.id, 'lastName', e.target.value)} />
                  <FormControl size="small">
                    <InputLabel>Relationship</InputLabel>
                    <Select value={b.relationship} label="Relationship" onChange={e => updateBeneficiary(b.id, 'relationship', e.target.value)}>
                      <MenuItem value="Spouse">Spouse</MenuItem>
                      <MenuItem value="Child">Child</MenuItem>
                      <MenuItem value="Estate">Estate</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField label="%" size="small" type="number" value={b.percentage} onChange={e => updateBeneficiary(b.id, 'percentage', Number(e.target.value))} />
                  <IconButton size="small" onClick={() => removeBeneficiary(b.id)} sx={{ mt: 0.5, color: TEXT_SECONDARY, '&:hover': { color: '#EF5350' } }}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              <Button size="small" startIcon={<AddIcon />} onClick={() => addBeneficiary('contingent')} sx={{ color: TEXT_SECONDARY }}>Add Contingent Beneficiary</Button>
            </Box>
          )}

          {/* TAB 3: Disclosures */}
          {tab === 3 && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Replacement Questions</Typography>
              <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1.5, mb: 2 }}>
                <Typography sx={{ fontSize: '0.85rem', mb: 1 }}><strong>1.</strong> Does this policy replace or change an existing life insurance policy or annuity contract?</Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  {['No', 'Yes'].map(opt => (
                    <FormControlLabel key={opt} control={<Checkbox checked={opt === 'No' ? !rep1 : rep1} onChange={() => setRep1(opt === 'Yes')} />} label={opt} sx={{ '& .MuiTypography-root': { fontSize: '0.85rem' } }} />
                  ))}
                </Box>
                <Typography sx={{ fontSize: '0.85rem', mb: 1 }}><strong>2.</strong> Within the past 36 months, has any application for life insurance been declined, postponed, or modified?</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {['No', 'Yes'].map(opt => (
                    <FormControlLabel key={opt} control={<Checkbox checked={opt === 'No' ? !rep2 : rep2} onChange={() => setRep2(opt === 'Yes')} />} label={opt} sx={{ '& .MuiTypography-root': { fontSize: '0.85rem' } }} />
                  ))}
                </Box>
              </Box>

              <Typography variant="subtitle2" sx={{ mb: 1 }}>Consent & Authorization</Typography>
              <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1.5, mb: 2 }}>
                <Typography sx={{ fontSize: '0.78rem', color: TEXT_SECONDARY, lineHeight: 1.6 }}>
                  I acknowledge that I have received the Outline of Coverage and understand the terms and conditions of this preneed funeral insurance policy. I authorize Bloom Insurance to process my application and verify the information provided. All information provided in this application is true and complete to the best of my knowledge.
                </Typography>
              </Box>
              <FormControlLabel
                control={<Checkbox checked={disclosures} onChange={e => setDisclosures(e.target.checked)} sx={{ color: CYAN }} />}
                label={<Typography sx={{ fontSize: '0.85rem' }}>I have read and agree to the above disclosure</Typography>}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack}>← Back</Button>
        <Button variant="contained" color="secondary" onClick={() => { save(); onNext(); }}>
          Continue →
        </Button>
      </Box>
    </Box>
  );
}
