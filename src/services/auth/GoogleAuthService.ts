import { gapi } from 'gapi-script';
import { getGoogleClientId, getGoogleApiKey } from '../../utils/config';

// Get configuration from environment variables
const GOOGLE_CLIENT_ID = getGoogleClientId();
const API_KEY = getGoogleApiKey();

// Discovery doc URL for APIs used
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/people/v1/rest';

// Authorization scopes required
const SCOPES = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';

interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export class GoogleAuthService {
  private static instance: GoogleAuthService;
  private tokenClient: any = null;
  private gapiInited = false;
  private gisInited = false;

  private constructor() {}

  public static getInstance(): GoogleAuthService {
    if (!GoogleAuthService.instance) {
      GoogleAuthService.instance = new GoogleAuthService();
    }
    return GoogleAuthService.instance;
  }
  public init(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (this.gapiInited) {
          // Already initialized
          resolve();
          return;
        }
        
        gapi.load('client:auth2', async () => {
          try {
            await gapi.client.init({
              apiKey: API_KEY,
              clientId: GOOGLE_CLIENT_ID,
              discoveryDocs: [DISCOVERY_DOC],
              scope: SCOPES,
            });
            
            // Initialize auth2
            await gapi.auth2.init({
              client_id: GOOGLE_CLIENT_ID,
              scope: SCOPES
            });
            
            this.gapiInited = true;
            
            // Auto-refresh token if needed
            if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
              gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse();
            }
            
            resolve();
          } catch (initError) {
            console.error('Error initializing Google API client:', initError);
            reject(initError);
          }
        }, (loadError: any) => {
          console.error('Error loading Google API client:', loadError);
          reject(loadError);
        });
      } catch (error) {
        console.error('Unexpected error during Google API initialization:', error);
        reject(error);
      }
    });
  }
  public async signIn(): Promise<GoogleUserInfo> {
    if (!this.gapiInited) {
      try {
        await this.init();
      } catch (initError) {
        console.error('Failed to initialize Google API:', initError);
        throw new Error('Google authentication initialization failed. Please try again later.');
      }
    }

    try {
      const authResponse = await gapi.auth2.getAuthInstance().signIn({
        prompt: 'select_account' // Always show account selector
      });
      
      if (!authResponse) {
        throw new Error('Google sign-in failed: No auth response received');
      }
      
      const profile = authResponse.getBasicProfile();
      if (!profile) {
        throw new Error('Failed to retrieve user profile from Google');
      }
      
      // Verify we have all required user data
      const id = profile.getId();
      const email = profile.getEmail();
      const name = profile.getName();
      
      if (!id || !email || !name) {
        throw new Error('Missing required profile information from Google account');
      }
      
      return {
        id,
        email,
        name,
        given_name: profile.getGivenName() || '',
        family_name: profile.getFamilyName() || '',
        picture: profile.getImageUrl() || '',
      };
    } catch (error: any) {
      // Handle user cancellation gracefully
      if (error.error === 'popup_closed_by_user' || 
          error.details === 'The user closed the popup.') {
        throw new Error('Google sign-in was cancelled');
      }
      
      console.error('Error signing in with Google', error);
      throw new Error('Google authentication failed. Please try again.');
    }
  }
  public async signOut(): Promise<void> {
    if (!this.gapiInited) {
      try {
        await this.init();
      } catch (error) {
        console.error('Failed to initialize Google API during sign out:', error);
        // Continue with sign out attempt anyway
      }
    }
    
    try {
      await gapi.auth2.getAuthInstance().signOut();
    } catch (error) {
      console.error('Error signing out of Google', error);
      throw new Error('Failed to sign out of Google account');
    }
  }

  public async isSignedIn(): Promise<boolean> {
    try {
      if (!this.gapiInited) {
        await this.init();
      }
      return gapi.auth2.getAuthInstance().isSignedIn.get();
    } catch (error) {
      console.error('Failed to check Google sign-in status:', error);
      return false;
    }
  }
  public async getUserInfo(): Promise<GoogleUserInfo | null> {
    try {
      if (!this.gapiInited) {
        await this.init();
      }
      
      if (!(await this.isSignedIn())) {
        return null;
      }
      
      const user = gapi.auth2.getAuthInstance().currentUser.get();
      const profile = user.getBasicProfile();
      
      if (!profile) {
        console.error('No user profile found');
        return null;
      }
      
      return {
        id: profile.getId(),
        email: profile.getEmail(),
        name: profile.getName(),
        given_name: profile.getGivenName() || '',
        family_name: profile.getFamilyName() || '',
        picture: profile.getImageUrl() || '',
      };
    } catch (error) {
      console.error('Error getting user info', error);
      return null;
    }
  }
}

export default GoogleAuthService.getInstance();
