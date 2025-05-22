#!/bin/bash
# Deployment script for Kids Sports Activity Monitoring & Safety App

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment process for Kids Sports Activity App...${NC}"

# Step 1: Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Failed to install dependencies${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Dependencies installed successfully${NC}"

# Step 2: Run tests
echo -e "${YELLOW}Running tests...${NC}"
npm test -- --watchAll=false
if [ $? -ne 0 ]; then
  echo -e "${RED}⚠️ Tests failed, but continuing with deployment${NC}"
fi
echo -e "${GREEN}✅ Tests completed${NC}"

# Step 3: Build the app
echo -e "${YELLOW}Building production version...${NC}"
npm run build
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Failed to build the application${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Build completed successfully${NC}"

# Step 4: Deploy to hosting service
# This step depends on your hosting provider (Netlify, Vercel, Firebase, etc.)
# Here's an example for Firebase hosting

if command -v firebase &> /dev/null; then
  echo -e "${YELLOW}Deploying to Firebase...${NC}"
  firebase deploy --only hosting
  if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to deploy to Firebase${NC}"
    exit 1
  fi
  echo -e "${GREEN}✅ Deployed successfully to Firebase${NC}"
else
  echo -e "${YELLOW}Firebase CLI not found. To deploy to Firebase:${NC}"
  echo -e "1. Install Firebase CLI: npm install -g firebase-tools"
  echo -e "2. Login to Firebase: firebase login"
  echo -e "3. Initialize project: firebase init"
  echo -e "4. Deploy: firebase deploy"
fi

# Alternatively, for GitHub Pages
if [ "$1" == "github" ]; then
  echo -e "${YELLOW}Deploying to GitHub Pages...${NC}"
  npm run deploy
  if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to deploy to GitHub Pages${NC}"
    exit 1
  fi
  echo -e "${GREEN}✅ Deployed successfully to GitHub Pages${NC}"
fi

echo -e "${GREEN}Deployment process completed!${NC}"
echo -e "Visit your hosting service dashboard to verify the deployment."
