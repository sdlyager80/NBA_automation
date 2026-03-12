import { Box, Card, CardContent, Typography, Stepper, Step, StepLabel, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { ApplicationProvider, useApplication } from '../../store/ApplicationContext';
import Step1FuneralHome from './steps/Step1FuneralHome';
import Step2PlanServices from './steps/Step2PlanServices';
import Step3ApplicantDetails from './steps/Step3ApplicantDetails';
import Step4PaymentSetup from './steps/Step4PaymentSetup';
import Step5ReviewSubmit from './steps/Step5ReviewSubmit';
import { NAVY_DARK, BORDER, CYAN } from '../../theme/tokens';

const STEPS = ['Funeral Home & Product', 'Plan & Services', 'Applicant Details', 'Payment Setup', 'Sign & Submit'];

function WizardContent() {
  const { currentStep, setCurrentStep } = useApplication();

  const next = () => setCurrentStep(Math.min(currentStep + 1, STEPS.length - 1));
  const back = () => setCurrentStep(Math.max(currentStep - 1, 0));

  return (
    <Box>
      {/* Wizard Stepper */}
      <Card sx={{ mb: 3, border: `1px solid ${BORDER}` }}>
        <CardContent sx={{ py: '16px !important' }}>
          <Stepper activeStep={currentStep} alternativeLabel>
            {STEPS.map((label, i) => (
              <Step key={label} completed={i < currentStep} onClick={() => i < currentStep && setCurrentStep(i)} sx={{ cursor: i < currentStep ? 'pointer' : 'default' }}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === 0 && <Step1FuneralHome onNext={next} />}
      {currentStep === 1 && <Step2PlanServices onNext={next} onBack={back} />}
      {currentStep === 2 && <Step3ApplicantDetails onNext={next} onBack={back} />}
      {currentStep === 3 && <Step4PaymentSetup onNext={next} onBack={back} />}
      {currentStep === 4 && <Step5ReviewSubmit onBack={back} />}
    </Box>
  );
}

export default function NewApplicationPage() {
  const navigate = useNavigate();

  return (
    <ApplicationProvider>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>New Preneed Policy Application</Typography>
            <Typography variant="body2">Complete each step to submit the application for automated review.</Typography>
          </Box>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ color: 'text.secondary' }}>
            Back to Dashboard
          </Button>
        </Box>
        <WizardContent />
      </Box>
    </ApplicationProvider>
  );
}
