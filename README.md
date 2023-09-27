# Chat App - React Native

The React Native Chat App is a mobile application designed for seamless communication with friends and family. Built using React Native, this app facilitates text messaging, image sharing, and location sharing. It serves as a showcase of React Native development skills and leverages Firebase for real-time data management.

## Technology Stack

React Native
React Native Gifted Chat library
Expo (for cross-platform development)
Google Firestore Database
Google Firebase Authentication
Firebase Cloud Storage (for media files)
Expo ImagePicker & MediaLibrary (for communication features)
AsyncStorage (for offline data caching)


## Key Features

### Personalize 

Customize your chat screen by selecting between different background colors and choosing a display name.

### Real-Time Messaging: 

Engage in real-time conversations with an intuitive chat interface, ensuring swift and fluid communication.

### Multimedia Sharing: 

Effortlessly share images within your conversations, adding depth and visual context to your chats.

### Location Sharing: 

Coordinate meetups and plan events with ease by sharing your location with friends.


### Offline Access: 

Stay connected even without an internet connection, thanks to data caching that enables uninterrupted chatting.



## Getting Started

To set up and run the Chat App on your device, follow these steps:

Ensure Node.js 16.19.0 or a compatible version is installed:

bash
Copy code
npm install 16.19.0
npm use 16.19.0
npm alias default 16.19.0
Install Expo CLI globally:

bash
Copy code
npm install -g expo-cli
Create an Expo account at Expo and install the Expo Go app on your smartphone or set up a virtual machine on your computer.

Create a new Chat App project with React Native:

bash
Copy code
npx create-expo-app ChatApp --template
Start Expo:

bash
Copy code
npm start
To resolve image-related issues, run:

bash
Copy code
npm i whatwg-fetch@3.6.2
Connect your smartphone (install Expo Go app) or use an emulator to preview Chat App.

Database Configuration
If you want to use your own database, follow these steps:

Create a new database on Firebase (signup required).

Install Firebase:

bash
Copy code
npm i firebase
Navigate to the Firebase console, create a new project, and set up Firestore Database in production mode.

Adjust Firestore rules to allow read and write:

bash
Copy code
allow read, write: if true;
Create a web app and copy the Firebase configuration code (starts with const firebaseConfig =) into App.js, replacing the existing code.

Android Studio Integration
To unlock all features, install these libraries:

bash
Copy code
expo install expo-image-picker
expo install react-native-maps
expo install expo-location
expo install expo-media-library
GitHub Repository
Find the Chat App source code on GitHub.

License
This project is licensed under the MIT License.