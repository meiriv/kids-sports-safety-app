import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  Typography,
  CircularProgress 
} from '@mui/material';
import { useEmergency } from '../../context/EmergencyContext';

interface EmergencyAlertProps {
  onEmergencyTriggered?: () => void;
}

const EmergencyAlert: React.FC<EmergencyAlertProps> = ({ 
  onEmergencyTriggered 
}) => {
  const { 
    emergencyMode, 
    countdownActive, 
    countdownSeconds, 
    activeAlert,
    triggerEmergency,
    cancelEmergency,
    resolveEmergency
  } = useEmergency();
  
  const [showDialog, setShowDialog] = useState<boolean>(false);
  
  // Show dialog when emergency is active or countdown is running
  useEffect(() => {
    setShowDialog(emergencyMode || countdownActive);
    
    if (emergencyMode && onEmergencyTriggered) {
      onEmergencyTriggered();
    }
  }, [emergencyMode, countdownActive, onEmergencyTriggered]);
  
  // Emergency button handler
  const handleEmergencyButton = () => {
    triggerEmergency('userInitiated');
  };
  
  // Cancel button handler
  const handleCancel = () => {
    cancelEmergency();
    setShowDialog(false);
  };
  
  // Resolve button handler
  const handleResolve = () => {
    resolveEmergency();
    setShowDialog(false);
  };
  
  return (
    <>
      {/* Emergency button */}
      <Button
        variant="contained"
        color="error"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          borderRadius: '50%',
          width: 64,
          height: 64,
          zIndex: 1000,
          fontWeight: 'bold',
          fontSize: '12px'
        }}
        onClick={handleEmergencyButton}
      >
        SOS
      </Button>
      
      {/* Countdown Dialog */}
      <Dialog 
        open={countdownActive && showDialog} 
        onClose={handleCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>
          Emergency Alert Countdown
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2, pb: 2 }}>
            <CircularProgress 
              variant="determinate" 
              value={(countdownSeconds / 10) * 100} 
              size={100}
              thickness={5}
              color="error"
              sx={{ mb: 2 }}
            />
            <Typography variant="h2" color="error.main">
              {countdownSeconds}
            </Typography>
            <Typography variant="h6" align="center" sx={{ mt: 2 }}>
              Emergency alert will be triggered in {countdownSeconds} seconds
            </Typography>
            <Typography variant="body1" align="center" sx={{ mt: 1 }}>
              Press Cancel if this is not an emergency
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCancel} 
            variant="contained" 
            color="primary"
            size="large"
            sx={{ mb: 1, mr: 2 }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Emergency Active Dialog */}
      <Dialog 
        open={emergencyMode && showDialog} 
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>
          EMERGENCY ALERT ACTIVE
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Emergency contacts are being notified.
            </Typography>
            {activeAlert && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">
                  <strong>Type:</strong> {activeAlert.type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Typography>
                <Typography variant="body1">
                  <strong>Time:</strong> {activeAlert.timestamp.toLocaleTimeString()}
                </Typography>
                {activeAlert.notifiedContacts.length > 0 && (
                  <Typography variant="body1">
                    <strong>Contacts Notified:</strong> {activeAlert.notifiedContacts.length}
                  </Typography>
                )}
              </Box>
            )}
            
            <Box sx={{ mt: 3, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
              <Typography variant="body1" color="white">
                If this is not an emergency, please press "False Alarm" immediately to cancel the alert.
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            onClick={handleCancel}
            variant="contained" 
            color="primary"
            size="large"
          >
            False Alarm
          </Button>
          <Button 
            onClick={handleResolve}
            variant="contained" 
            color="success"
            size="large"
          >
            Resolved
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EmergencyAlert;
