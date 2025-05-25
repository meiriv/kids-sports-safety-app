# Setting Up Google Authentication

This guide will help you set up Google OAuth 2.0 credentials for authentication in the Kids Sports Safety App.

## Step 1: Create a Google Cloud Console Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Select a project" at the top of the page
3. Click "New Project" and give it a name (e.g., "Kids Sports Safety App")
4. Click "Create"

## Step 2: Set Up OAuth Consent Screen

1. In the Google Cloud Console, go to "APIs & Services" > "OAuth consent screen"
2. Select "External" user type (unless you have a Google Workspace)
3. Fill in the required app information:
   - App name: "Kids Sports Safety App"
   - User support email: Your email address
   - Developer contact information: Your email address
4. Click "Save and Continue"
5. Under "Scopes," add the following scopes:
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
6. Click "Save and Continue"
7. Add any test users (your Google accounts)
8. Click "Save and Continue" to complete the setup

## Step 3: Create OAuth 2.0 Credentials

1. In the Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" and select "OAuth client ID"
3. Under "Application type," select "Web application"
4. Give it a name (e.g., "Kids Sports Safety Web Client")
5. Add authorized JavaScript origins:
   - For development: `http://localhost:3000`
   - For production: Your production domain (e.g., `https://kids-sports-safety.example.com`)
6. Add authorized redirect URIs:
   - For development: `http://localhost:3000`
   - For production: Your production domain (e.g., `https://kids-sports-safety.example.com`)
7. Click "Create"

You'll receive a Client ID and Client Secret. Copy the Client ID.

## Step 4: Configure Your Application

1. Create a `.env.local` file in the root of your project
2. Add your Google Client ID:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your-client-id-here
   ```
3. If you need an API key for additional Google APIs, go back to "Credentials" in Google Cloud Console
4. Click "Create Credentials" and select "API key"
5. Copy the generated API key and add it to your `.env.local` file:
   ```
   REACT_APP_GOOGLE_API_KEY=your-api-key-here
   ```

## Step 5: Enable Required APIs

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for and enable the following APIs:
   - "Google People API" (for accessing user profile information)

## Step 6: Verify Your Configuration

1. Start your application
2. Try signing in with Google
3. Make sure you can successfully authenticate and see your profile information

## Troubleshooting

- If you see "popup_closed_by_user" errors, make sure your browser is not blocking popups
- If authentication fails, verify that your Client ID is correctly configured in the app
- Check the JavaScript console for detailed error messages

For more information, refer to the [Google Identity documentation](https://developers.google.com/identity/gsi/web/guides/overview).
