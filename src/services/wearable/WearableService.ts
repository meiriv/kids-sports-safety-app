import { WearableDevice, BiometricReading } from '../../types/models';

// This service handles the integration with wearable devices
// In a real application, this would connect to BLE devices or use device-specific APIs
export class WearableService {
  
  private static instance: WearableService;
  private connectedDevices: WearableDevice[] = [];
  private listeners: ((readings: BiometricReading) => void)[] = [];
  private simulationInterval: number | null = null;

  // Singleton pattern
  public static getInstance(): WearableService {
    if (!WearableService.instance) {
      WearableService.instance = new WearableService();
    }
    return WearableService.instance;
  }

  // Get available devices - in a real app, this would scan for BLE devices
  public async getAvailableDevices(): Promise<WearableDevice[]> {
    // In a real app, this would discover nearby Bluetooth devices
    // For now, we'll return simulated devices
    return [
      {
        id: 'device-1',
        userId: 'current-user',
        type: 'smartwatch',
        name: 'KidFit Watch',
        model: 'KF-100',
        connected: false,
        lastSyncTime: new Date(),
        batteryLevel: 85
      },
      {
        id: 'device-2',
        userId: 'current-user',
        type: 'fitnesstracker',
        name: 'ActiveBand',
        model: 'AB-Pro',
        connected: false,
        lastSyncTime: new Date(),
        batteryLevel: 72
      }
    ];
  }

  // Connect to a wearable device
  public async connectToDevice(deviceId: string): Promise<WearableDevice | null> {
    try {
      // Get device information
      const devices = await this.getAvailableDevices();
      const device = devices.find(d => d.id === deviceId);
      
      if (!device) {
        throw new Error(`Device ${deviceId} not found`);
      }
      
      // In a real app, this would establish a BLE connection
      console.log(`Connecting to device: ${device.name}`);
      
      // Update device status
      const connectedDevice: WearableDevice = {
        ...device,
        connected: true,
        lastSyncTime: new Date()
      };
      
      // Add to connected devices
      this.connectedDevices = [
        ...this.connectedDevices.filter(d => d.id !== deviceId),
        connectedDevice
      ];
      
      // Start simulating biometric data
      this.startSimulation(connectedDevice);
      
      return connectedDevice;
    } catch (error) {
      console.error('Error connecting to device:', error);
      return null;
    }
  }

  // Disconnect from a device
  public async disconnectFromDevice(deviceId: string): Promise<boolean> {
    try {
      const device = this.connectedDevices.find(d => d.id === deviceId);
      
      if (!device) {
        return false;
      }
      
      // In a real app, this would close the BLE connection
      console.log(`Disconnecting from device: ${device.name}`);
      
      // Update connected devices list
      this.connectedDevices = this.connectedDevices.filter(d => d.id !== deviceId);
      
      // Stop simulation for this device if no more connected devices
      if (this.connectedDevices.length === 0) {
        this.stopSimulation();
      }
      
      return true;
    } catch (error) {
      console.error('Error disconnecting from device:', error);
      return false;
    }
  }

  // Get list of connected devices
  public getConnectedDevices(): WearableDevice[] {
    return [...this.connectedDevices];
  }

  // Register a listener for biometric data
  public addBiometricDataListener(listener: (reading: BiometricReading) => void): void {
    this.listeners.push(listener);
  }

  // Remove a listener
  public removeBiometricDataListener(listener: (reading: BiometricReading) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  // Start simulating biometric data from the device
  private startSimulation(device: WearableDevice): void {
    if (this.simulationInterval === null) {
      // Simulate receiving data every 1 second
      this.simulationInterval = window.setInterval(() => {
        this.simulateReading(device);
      }, 1000);
    }
  }

  // Stop simulation
  private stopSimulation(): void {
    if (this.simulationInterval !== null) {
      window.clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  // Generate simulated biometric reading
  private simulateReading(device: WearableDevice): void {
    // Create a random reading
    const reading: BiometricReading = {
      id: `reading-${Date.now()}`,
      userId: device.userId,
      deviceId: device.id,
      timestamp: new Date(),
      heartRate: 70 + Math.floor(Math.random() * 30), // 70-100 bpm
      steps: Math.floor(Math.random() * 10), // 0-10 steps per second
      calories: Math.floor(Math.random() * 2), // 0-2 calories per second
      activity: Math.random() > 0.7 ? 'active' : 'idle',
      motionData: {
        acceleration: {
          x: (Math.random() - 0.5) * 2, // -1 to 1
          y: (Math.random() - 0.5) * 2, // -1 to 1
          z: (Math.random() - 0.5) * 2 // -1 to 1
        },
        gyroscope: {
          x: (Math.random() - 0.5) * 4, // -2 to 2
          y: (Math.random() - 0.5) * 4, // -2 to 2
          z: (Math.random() - 0.5) * 4 // -2 to 2
        }
      }
    };
    
    // Notify all listeners
    this.listeners.forEach(listener => {
      try {
        listener(reading);
      } catch (error) {
        console.error('Error in biometric data listener:', error);
      }
    });
  }

  // Get the latest biometric data (for devices that don't stream continuously)
  public async getLatestBiometricData(deviceId: string): Promise<BiometricReading | null> {
    const device = this.connectedDevices.find(d => d.id === deviceId);
    
    if (!device) {
      return null;
    }
    
    // In a real app, this would fetch the latest data from the device
    // For simulation, we'll just create a random reading
    return {
      id: `reading-${Date.now()}`,
      userId: device.userId,
      deviceId: device.id,
      timestamp: new Date(),
      heartRate: 70 + Math.floor(Math.random() * 30),
      steps: Math.floor(Math.random() * 5000),
      calories: Math.floor(Math.random() * 500),
      activity: Math.random() > 0.5 ? 'active' : 'idle'
    };
  }
}
