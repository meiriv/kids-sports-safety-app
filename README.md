# Kids Sports Safety App

A React application designed to help kids stay active and safe while having fun with various physical activities.

## Features

- **Activity Tracking**: Uses camera-based motion detection to track kids' movements during activities
- **Multiple Activity Types**: Freestyle play, dance, and sports practice modes
- **Gamification**: Points system and achievements to motivate kids to stay active
- **Real-time Feedback**: Visual feedback on activity intensity and performance
- **Kid-friendly Interface**: Colorful, engaging design specifically for children

## Quick start:
    1. git clone https://github.com/meiriv/kids-sports-safety-app.git
    2. npm install
    3. npm start
## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## How to Use

1. From the home page, click on "Start New Activity" to begin
2. Choose an activity type (Freestyle Play, Dance Party, or Sports Practice)
3. Allow camera access when prompted
4. Click "Start Recording" to begin the activity session
5. Move around in front of the camera to see real-time feedback
6. Earn points by staying active
7. Click "Stop Recording" when finished to see your results

## Activity Types

### Freestyle Play
Free movement play with no specific patterns required. Just have fun running, jumping, and moving around!

### Dance Party
Show off your dance moves and grooves to the rhythm. All movement styles are encouraged!

### Sports Practice
Practice your favorite sports movements and get feedback on your form and technique.

## Technical Implementation

### Motion Detection

The app uses TensorFlow.js with the MoveNet model for real-time pose detection:

- Detects 17 key body points (nose, shoulders, elbows, wrists, etc.)
- Provides confidence scores for each detected point
- Analyzes movement patterns to determine activity levels

### Component Architecture

- **MotionContext**: Provides camera access and pose detection capabilities
- **GamificationContext**: Manages activity sessions, points, and achievements
- **ActivityPage**: Main interface for activity recording and feedback
- **MotionFeedback**: Analyzes pose data to provide real-time feedback
- **Camera**: Handles video capture and pose visualization

### Safety Features

- Emergency contact system for immediate assistance
- Activity monitoring to prevent overexertion
- Form analysis to encourage proper movement techniques

## Developer Instructions

### Adding New Activities

To add a new activity type:

1. Add the activity definition to `activityTypes` array in `ActivitySelectionPage.tsx`
2. Add specific movement detection logic in `MotionFeedback.tsx`
3. Update the UI to include the new activity option

### Customizing Feedback

The feedback system can be customized in `MotionFeedback.tsx`:

```tsx
// Example of customizing feedback thresholds
if (motionIntensity > 60) {
  setFeedback('Great job! Keep moving!');
} else if (motionIntensity > 30) {
  setFeedback('Good! Try to move a bit more');
} else {
  setFeedback('Move around more to earn points!');
}
```
