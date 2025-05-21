import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import WatchIcon from '@mui/icons-material/Watch';
import BluetoothIcon from '@mui/icons-material/Bluetooth';
import BluetoothDisabledIcon from '@mui/icons-material/BluetoothDisabled';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import BatteryAlertIcon from '@mui/icons-material/BatteryAlert';
import RefreshIcon from '@mui/icons-material/Refresh';
import { WearableDevice, BiometricReading } from '../../types/models';
import { WearableService } from '../../services/wearable/WearableService';

const WearableDeviceManager: React.FC = () => {
  const [availableDevices, setAvailableDevices] = useState<WearableDevice[]>([]);
  const [connectedDevices, setConnectedDevices] = useState<WearableDevice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [biometricData, setBiometricData] = useState<BiometricReading | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  
  const wearableService = WearableService.getInstance();
  
  // Load connected devices on component mount
  useEffect(() => {
    loadConnectedDevices();
  }, []);
  
  // Subscribe to biometric data updates from connected devices
  useEffect(() => {
    const handleBiometricUpdate = (reading: BiometricReading) => {
      setBiometricData(reading);
    };
    
    wearableService.addBiometricDataListener(handleBiometricUpdate);
    
    return () => {
      wearableService.removeBiometricDataListener(handleBiometricUpdate);
    };
  }, []);
  
  // Load currently connected devices
  const loadConnectedDevices = () => {
    const devices = wearableService.getConnectedDevices();
    setConnectedDevices(devices);
  };
  
  // Scan for available devices
  const scanForDevices = async () => {
    setScanning(true);
    
    try {
      const devices = await wearableService.getAvailableDevices();
      setAvailableDevices(devices);
    } catch (error) {
      console.error('Error scanning for devices:', error);
    } finally {
      setScanning(false);
    }
  };
  
  // Connect to a device
  const connectToDevice = async (deviceId: string) => {
    setLoading(true);
    
    try {
      const device = await wearableService.connectToDevice(deviceId);
      
      if (device) {
        loadConnectedDevices();
        setAvailableDevices(prev => prev.filter(d => d.id !== deviceId));
      }
    } catch (error) {
      console.error('Error connecting to device:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Disconnect from a device
  const disconnectFromDevice = async (deviceId: string) => {
    setLoading(true);
    
    try {
      const success = await wearableService.disconnectFromDevice(deviceId);
      
      if (success) {
        loadConnectedDevices();
        // Refresh available devices
        scanForDevices();
      }
    } catch (error) {
      console.error('Error disconnecting from device:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // View device details
  const viewDeviceDetails = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    setDialogOpen(true);
  };
  
  // Get device battery icon based on level
  const getBatteryIcon = (level: number) => {
    if (level > 20) {
      return <BatteryFullIcon sx={{ color: 'success.main' }} />;
    } else {
      return <BatteryAlertIcon sx={{ color: 'error.main' }} />;
    }
  };
  
  // Get device by ID
  const getDeviceById = (deviceId: string): WearableDevice | undefined => {
    return [...connectedDevices, ...availableDevices].find(d => d.id === deviceId);
  };
  
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            Connected Devices
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={scanForDevices}
            disabled={scanning}
          >
            {scanning ? 'Scanning...' : 'Scan for Devices'}
          </Button>
        </Box>
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        
        {/* Connected devices list */}
        {connectedDevices.length > 0 ? (
          <List>
            {connectedDevices.map((device) => (
              <React.Fragment key={device.id}>
                <ListItem
                  secondaryAction={
                    <Box>
                      {getBatteryIcon(device.batteryLevel)}
                      <IconButton 
                        edge="end" 
                        aria-label="disconnect" 
                        onClick={() => disconnectFromDevice(device.id)}
                      >
                        <BluetoothDisabledIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <WatchIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {device.name}
                        <Chip 
                          label="Connected" 
                          size="small" 
                          color="success" 
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2">
                        {device.type} • {device.model} • {device.batteryLevel}% battery
                      </Typography>
                    }
                    onClick={() => viewDeviceDetails(device.id)}
                    sx={{ cursor: 'pointer' }}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ textAlign: 'center', py: 3, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="body1" color="textSecondary">
              No devices connected
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Scan for available devices to connect
            </Typography>
          </Box>
        )}
        
        {/* Available devices */}
        {availableDevices.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Available Devices
            </Typography>
            <List>
              {availableDevices.map((device) => (
                <React.Fragment key={device.id}>
                  <ListItem
                    secondaryAction={
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<BluetoothIcon />}
                        onClick={() => connectToDevice(device.id)}
                        disabled={loading}
                      >
                        Connect
                      </Button>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <WatchIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={device.name}
                      secondary={`${device.type} • ${device.model}`}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}
        
        {/* Biometric data display */}
        {biometricData && connectedDevices.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Live Biometric Data
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Device: {connectedDevices.find(d => d.id === biometricData.deviceId)?.name || 'Unknown'}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Updated: {biometricData.timestamp.toLocaleTimeString()}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                {biometricData.heartRate && (
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: 'error.light', 
                    color: 'white', 
                    borderRadius: 2,
                    minWidth: 100,
                    textAlign: 'center'
                  }}>
                    <Typography variant="h5" fontWeight="bold">
                      {biometricData.heartRate}
                    </Typography>
                    <Typography variant="caption">
                      Heart Rate (BPM)
                    </Typography>
                  </Box>
                )}
                
                {biometricData.steps && (
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: 'primary.light', 
                    color: 'white', 
                    borderRadius: 2,
                    minWidth: 100,
                    textAlign: 'center'
                  }}>
                    <Typography variant="h5" fontWeight="bold">
                      {biometricData.steps}
                    </Typography>
                    <Typography variant="caption">
                      Steps
                    </Typography>
                  </Box>
                )}
                
                {biometricData.calories && (
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: 'warning.light', 
                    color: 'white', 
                    borderRadius: 2,
                    minWidth: 100,
                    textAlign: 'center'
                  }}>
                    <Typography variant="h5" fontWeight="bold">
                      {biometricData.calories}
                    </Typography>
                    <Typography variant="caption">
                      Calories
                    </Typography>
                  </Box>
                )}
                
                {biometricData.activity && (
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: biometricData.activity === 'active' ? 'success.light' : 'grey.400', 
                    color: 'white', 
                    borderRadius: 2,
                    minWidth: 100,
                    textAlign: 'center'
                  }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                      {biometricData.activity}
                    </Typography>
                    <Typography variant="caption">
                      Activity Status
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Box>
        )}
      </Paper>
      
      {/* Device details dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Device Details
        </DialogTitle>
        <DialogContent>
          {selectedDeviceId && (
            <>
              {(() => {
                const device = getDeviceById(selectedDeviceId);
                
                if (!device) {
                  return <DialogContentText>Device not found</DialogContentText>;
                }
                
                return (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        <WatchIcon />
                      </Avatar>
                      <Typography variant="h6">
                        {device.name}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        Device Type
                      </Typography>
                      <Typography variant="body1">
                        {device.type.charAt(0).toUpperCase() + device.type.slice(1)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        Model
                      </Typography>
                      <Typography variant="body1">
                        {device.model}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        Status
                      </Typography>
                      <Typography 
                        variant="body1" 
                        color={device.connected ? 'success.main' : 'text.primary'}
                      >
                        {device.connected ? 'Connected' : 'Not Connected'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        Battery Level
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getBatteryIcon(device.batteryLevel)}
                        <Typography variant="body1" sx={{ ml: 1 }}>
                          {device.batteryLevel}%
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        Last Sync
                      </Typography>
                      <Typography variant="body1">
                        {device.lastSyncTime.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                );
              })()}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Close
          </Button>
          {selectedDeviceId && getDeviceById(selectedDeviceId)?.connected ? (
            <Button 
              color="error" 
              onClick={() => {
                if (selectedDeviceId) {
                  disconnectFromDevice(selectedDeviceId);
                  setDialogOpen(false);
                }
              }}
            >
              Disconnect
            </Button>
          ) : selectedDeviceId && (
            <Button 
              color="primary" 
              variant="contained"
              onClick={() => {
                if (selectedDeviceId) {
                  connectToDevice(selectedDeviceId);
                  setDialogOpen(false);
                }
              }}
            >
              Connect
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WearableDeviceManager;
