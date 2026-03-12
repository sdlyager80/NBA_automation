import {
  Box, Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem,
  Grid, Chip, TextField, Button,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useState } from 'react';
import { useApplication } from '../../../store/ApplicationContext';
import { FUNERAL_HOMES } from '../../../services/mock/mockData';
import { PRODUCTS } from '../../../types/product.types';
import { BORDER, CYAN, TEXT_SECONDARY, NAVY_DARK } from '../../../theme/tokens';

interface Props { onNext: () => void; }

export default function Step1FuneralHome({ onNext }: Props) {
  const { step1, setStep1 } = useApplication();
  const [fhId, setFhId] = useState(step1.funeralHome?.sys_id ?? '');

  const selectedFH = FUNERAL_HOMES.find(fh => fh.sys_id === fhId);
  const availableProducts = selectedFH
    ? PRODUCTS.filter(p => selectedFH.availableProductIds.includes(p.sys_id))
    : [];

  const handleFHChange = (id: string) => {
    setFhId(id);
    const fh = FUNERAL_HOMES.find(f => f.sys_id === id);
    setStep1({ funeralHome: fh ?? null, product: null });
  };

  const selectProduct = (productId: string) => {
    const product = PRODUCTS.find(p => p.sys_id === productId) ?? null;
    setStep1({ product });
  };

  const canContinue = !!step1.funeralHome && !!step1.product;

  return (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="overline" sx={{ mb: 2, display: 'block' }}>Funeral Home Selection</Typography>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Associated Funeral Home *</InputLabel>
            <Select
              value={fhId}
              label="Associated Funeral Home *"
              onChange={e => handleFHChange(e.target.value)}
            >
              <MenuItem value=""><em>— Select Funeral Home —</em></MenuItem>
              {FUNERAL_HOMES.map(fh => (
                <MenuItem key={fh.sys_id} value={fh.sys_id}>
                  {fh.name} — {fh.address.street1}, {fh.address.city}, {fh.address.state}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedFH && (
            <Box sx={{ p: 1.5, bgcolor: 'rgba(0,174,239,0.05)', borderRadius: 1.5, border: `1px solid rgba(0,174,239,0.15)`, fontSize: '0.8rem' }}>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box><Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>FH License</Typography><Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{selectedFH.licenseNumber}</Typography></Box>
                <Box><Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>Contract Status</Typography><Chip label="Active" size="small" sx={{ bgcolor: '#0f2a15', color: '#66BB6A', border: '1px solid #1a4a22', fontSize: '0.65rem', fontWeight: 700 }} /></Box>
                <Box><Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>Contact</Typography><Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{selectedFH.contactName}</Typography></Box>
                <Box><Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>Available Products</Typography><Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{availableProducts.length}</Typography></Box>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {selectedFH && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="overline">Available Products</Typography>
              <Chip label={`Filtered for ${selectedFH.name}`} size="small" sx={{ bgcolor: 'rgba(0,174,239,0.08)', color: CYAN, border: `1px solid rgba(0,174,239,0.2)`, fontSize: '0.65rem' }} />
            </Box>
            <Grid container spacing={1.5}>
              {availableProducts.map(product => {
                const isSelected = step1.product?.sys_id === product.sys_id;
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.sys_id}>
                    <Box
                      onClick={() => selectProduct(product.sys_id)}
                      sx={{
                        border: `2px solid ${isSelected ? CYAN : BORDER}`,
                        borderRadius: 2,
                        p: 2,
                        cursor: 'pointer',
                        position: 'relative',
                        bgcolor: isSelected ? 'rgba(0,174,239,0.06)' : 'transparent',
                        transition: 'all 0.15s',
                        '&:hover': { borderColor: CYAN, bgcolor: 'rgba(0,174,239,0.04)' },
                      }}
                    >
                      {product.popular && (
                        <Chip label="Most Popular" size="small" sx={{ position: 'absolute', top: 8, right: isSelected ? 32 : 8, bgcolor: 'rgba(0,174,239,0.15)', color: CYAN, border: `1px solid ${CYAN}`, fontSize: '0.6rem', fontWeight: 700 }} />
                      )}
                      {isSelected && (
                        <CheckCircleOutlineIcon sx={{ position: 'absolute', top: 8, right: 8, color: CYAN, fontSize: 18 }} />
                      )}
                      <Typography sx={{ fontWeight: 700, mb: 0.5, fontSize: '0.9rem' }}>{product.name}</Typography>
                      <Typography sx={{ color: CYAN, fontWeight: 800, fontSize: '0.85rem', mb: 0.5 }}>
                        {product.productCode}
                      </Typography>
                      <Typography variant="caption" sx={{ color: TEXT_SECONDARY, display: 'block', mb: 1, lineHeight: 1.4 }}>
                        {product.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {product.highlights.slice(0, 2).map(h => (
                          <Chip key={h} label={h} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.04)', fontSize: '0.6rem', border: `1px solid ${BORDER}` }} />
                        ))}
                      </Box>
                      <Typography variant="caption" sx={{ color: TEXT_SECONDARY, display: 'block', mt: 1 }}>
                        Coverage: ${product.minFaceAmount.toLocaleString()} – ${product.maxFaceAmount.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      )}

      {step1.funeralHome && step1.product && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="overline" sx={{ mb: 2, display: 'block' }}>Applicant Basic Information</Typography>
            <Grid container spacing={2}>
              <Grid size={6}><TextField fullWidth label="First Name *" size="small" /></Grid>
              <Grid size={6}><TextField fullWidth label="Last Name *" size="small" /></Grid>
              <Grid size={4}><TextField fullWidth label="Date of Birth *" type="date" size="small" InputLabelProps={{ shrink: true }} /></Grid>
              <Grid size={4}><TextField fullWidth label="Phone *" size="small" /></Grid>
              <Grid size={4}><TextField fullWidth label="Email *" size="small" /></Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button variant="contained" color="secondary" disabled={!canContinue} onClick={onNext}>
          Save & Continue →
        </Button>
      </Box>
    </Box>
  );
}
