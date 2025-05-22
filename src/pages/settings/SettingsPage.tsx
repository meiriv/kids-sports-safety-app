import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  Button, 
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WearableDeviceManager from '../../components/wearable/WearableDeviceManager';
import { useAuth } from '../../context/AuthContext';
import { EmergencyContact } from '../../types/models';
import { useEmergency } from '../../context/EmergencyContext';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSelector from '../../components/common/LanguageSelector';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const SettingsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState<number>(0);
  const [notifications, setNotifications] = useState<boolean>(true);
  const [emergencyAuto, setEmergencyAuto] = useState<boolean>(true);
  const [voiceGuidance, setVoiceGuidance] = useState<boolean>(true);
  const [contactDialogOpen, setContactDialogOpen] = useState<boolean>(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [contactName, setContactName] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactRelationship, setContactRelationship] = useState<string>('');
  const [contactIsEmergencyService, setContactIsEmergencyService] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  
  const { currentUser } = useAuth();
  const { emergencyContacts, setEmergencyContacts } = useEmergency();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleSaveGeneralSettings = () => {
    // In a real app, this would save to backend
    console.log('Saving settings:', { notifications, emergencyAuto, voiceGuidance });
    setSaveSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };
  
  const handleAddContact = () => {
    setEditingContact(null);
    setContactName('');
    setContactPhone('');
    setContactRelationship('');
    setContactIsEmergencyService(false);
    setContactDialogOpen(true);
  };
  
  const handleEditContact = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setContactName(contact.name);
    setContactPhone(contact.phone);
    setContactRelationship(contact.relationship);
    setContactIsEmergencyService(contact.isEmergencyService || false);
    setContactDialogOpen(true);
  };
  
  const handleDeleteContact = (contactId: string) => {
    const updatedContacts = emergencyContacts.filter(c => c.id !== contactId);
    setEmergencyContacts(updatedContacts);
  };
  
  const handleSaveContact = () => {
    if (editingContact) {
      // Update existing contact
      const updatedContacts = emergencyContacts.map(c => 
        c.id === editingContact.id 
          ? {
              ...c,
              name: contactName,
              phone: contactPhone,
              relationship: contactRelationship,
              isEmergencyService: contactIsEmergencyService
            }
          : c
      );
      
      setEmergencyContacts(updatedContacts);
    } else {
      // Add new contact
      const newContact: EmergencyContact = {
        id: `contact-${Date.now()}`,
        name: contactName,
        phone: contactPhone,
        relationship: contactRelationship,
        isEmergencyService: contactIsEmergencyService
      };
      
      setEmergencyContacts([...emergencyContacts, newContact]);
    }
    
    setContactDialogOpen(false);
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Settings
      </Typography>
      
      <Paper elevation={3} sx={{ mt: 3, borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          aria-label="settings tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="General" />
          <Tab label="Emergency Contacts" />
          <Tab label="Wearable Devices" />
          <Tab label="Account" />
        </Tabs>
        
        {/* General Settings */}
        <TabPanel value={tabValue} index={0}>
          {saveSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Settings saved successfully!
            </Alert>
          )}
            <Typography variant="h6" gutterBottom>
            {t('settings.language')}
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <LanguageSelector />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1, ml: 4 }}>
              {isRTL ? 'שינוי השפה ישפיע על כל תוכן האפליקציה וכיוון הטקסט' : 'Changing the language will affect all app content and text direction'}
            </Typography>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            {t('settings.notifications')}
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <FormControlLabel
              control={
                <Switch 
                  checked={notifications} 
                  onChange={(e) => setNotifications(e.target.checked)}
                  color="primary"
                />
              }
              label={t('settings.notifications')}
            />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5, ml: 4 }}>
              Receive notifications for achievements, reminders and activity suggestions
            </Typography>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <FormControlLabel
              control={
                <Switch 
                  checked={emergencyAuto} 
                  onChange={(e) => setEmergencyAuto(e.target.checked)}
                  color="primary"
                />
              }
              label="Automatic emergency detection"
            />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5, ml: 4 }}>
              Automatically detect potential emergencies based on motion patterns
            </Typography>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <FormControlLabel
              control={
                <Switch 
                  checked={voiceGuidance} 
                  onChange={(e) => setVoiceGuidance(e.target.checked)}
                  color="primary"
                />
              }
              label="Voice guidance during exercises"
            />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5, ml: 4 }}>
              Receive voice instructions and feedback during activity sessions
            </Typography>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Activity Monitoring
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <TextField
              select
              label="Exercise Difficulty"
              value="automatic"
              SelectProps={{
                native: true,
              }}
              fullWidth
              variant="outlined"
              sx={{ mb: 3 }}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="automatic">Automatic (based on performance)</option>
            </TextField>
            
            <TextField
              select
              label="Motion Tracking Sensitivity"
              value="medium"
              SelectProps={{
                native: true,
              }}
              fullWidth
              variant="outlined"
              sx={{ mb: 3 }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </TextField>
          </Box>
            <Button 
            variant="contained" 
            onClick={handleSaveGeneralSettings}
            sx={{ mt: 2 }}
          >
            {t('buttons.save')}
          </Button>
        </TabPanel>
        
        {/* Emergency Contacts */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Emergency Contacts
            </Typography>
            <Button 
              startIcon={<AddIcon />}
              variant="contained"
              onClick={handleAddContact}
            >
              Add Contact
            </Button>
          </Box>
          
          <Typography variant="body2" color="textSecondary" paragraph>
            These contacts will be notified in case of an emergency. Make sure to include at least one trusted adult.
          </Typography>
          
          {emergencyContacts.length > 0 ? (
            <List sx={{ mb: 3 }}>
              {emergencyContacts.map((contact) => (
                <React.Fragment key={contact.id}>
                  <ListItem
                    secondaryAction={
                      <Box>
                        <IconButton 
                          edge="end" 
                          aria-label="edit" 
                          onClick={() => handleEditContact(contact)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          edge="end" 
                          aria-label="delete" 
                          onClick={() => handleDeleteContact(contact.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {contact.name}
                          {contact.isEmergencyService && (
                            <Box 
                              sx={{ 
                                ml: 1,
                                bgcolor: 'error.main', 
                                color: 'white', 
                                px: 1, 
                                py: 0.2, 
                                borderRadius: 1,
                                fontSize: '0.7rem'
                              }}
                            >
                              EMERGENCY SERVICE
                            </Box>
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            {contact.phone}
                          </Typography>
                          <Typography component="span" variant="body2" sx={{ ml: 1 }}>
                            • {contact.relationship}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', mb: 3 }}>
              <Typography variant="body1" color="textSecondary">
                No emergency contacts added yet.
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Please add at least one emergency contact.
              </Typography>
            </Paper>
          )}
          
          <Alert severity="info">
            We recommend adding at least 2 emergency contacts to ensure someone can be reached in case of an emergency.
          </Alert>
        </TabPanel>
        
        {/* Wearable Devices Tab */}
        <TabPanel value={tabValue} index={2}>
          <WearableDeviceManager />
        </TabPanel>
        
        {/* Account Settings Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Account Information
          </Typography>
          
          {currentUser && (
            <Box sx={{ mb: 4 }}>
              <TextField
                label="Display Name"
                defaultValue={currentUser.displayName}
                fullWidth
                variant="outlined"
                sx={{ mb: 3 }}
              />
              
              <TextField
                label="Email Address"
                defaultValue={currentUser.email}
                fullWidth
                variant="outlined"
                sx={{ mb: 3 }}
                disabled
              />
              
              <TextField
                label="Age"
                defaultValue={currentUser.age || ''}
                fullWidth
                variant="outlined"
                sx={{ mb: 3 }}
                type="number"
              />
            </Box>
          )}
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Privacy Settings
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <FormControlLabel
              control={<Switch defaultChecked color="primary" />}
              label="Allow appearing in leaderboards"
            />
            
            <FormControlLabel
              control={<Switch defaultChecked color="primary" />}
              label="Share activity achievements with friends"
            />
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              variant="contained" 
              color="primary"
            >
              Save Changes
            </Button>
            
            <Button 
              variant="outlined" 
              color="error"
            >
              Delete Account
            </Button>
          </Box>
        </TabPanel>
      </Paper>
      
      {/* Add/Edit Contact Dialog */}
      <Dialog open={contactDialogOpen} onClose={() => setContactDialogOpen(false)}>
        <DialogTitle>
          {editingContact ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            label="Phone Number"
            fullWidth
            variant="outlined"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Relationship"
            fullWidth
            variant="outlined"
            value={contactRelationship}
            onChange={(e) => setContactRelationship(e.target.value)}
            placeholder="e.g., Parent, Guardian, Teacher, Coach"
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Switch 
                checked={contactIsEmergencyService} 
                onChange={(e) => setContactIsEmergencyService(e.target.checked)}
                color="primary"
              />
            }
            label="This is an emergency service (ambulance, hospital, etc.)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveContact} 
            variant="contained"
            disabled={!contactName || !contactPhone || !contactRelationship}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SettingsPage;
