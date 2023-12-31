import React, { useEffect } from 'react';
//import { ImageBackground, StyleSheet, Text, View, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNetInfo } from "@react-native-community/netinfo";
import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

import Start from './components/Start';
import Chat from './components/Chat';

const Stack = createNativeStackNavigator();

import { LogBox, Alert } from 'react-native';
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

/**
 * Entry point of the chat application.
 *
 * This application includes routing and database connectivity.
 *
 * @returns {JSX.Element} The root component.
 */
const App = () => {

  const connectionStatus = useNetInfo();

  /**
   * Configuration object for Firebase.
   *
   * Replace the placeholder values with actual Firebase configuration details.
   *
   * @type {Object}
   * @property {string} apiKey - Firebase API key.
   * @property {string} authDomain - Firebase authentication domain.
   * @property {string} databaseURL - Firebase database URL.
   * @property {string} projectId - Firebase project ID.
   * @property {string} storageBucket - Firebase storage bucket.
   * @property {string} messagingSenderId - Firebase messaging sender ID.
   * @property {string} appId - Firebase application ID.
   * @property {string} measurementId - Firebase measurement ID (optional).
   */
  const firebaseConfig = {
    apiKey: "AIzaSyDNRzkN7ZehikUwwK2W1lhY4apVYiNN3l4",
    authDomain: "chatapp-81ccf.firebaseapp.com",
    databaseURL: "https://chatapp-81ccf-default-rtdb.firebaseio.com",
    projectId: "chatapp-81ccf",
    storageBucket: "chatapp-81ccf.appspot.com",
    messagingSenderId: "400221256922",
    appId: "1:400221256922:web:b5dba661a8b2cf946a79e3",
    measurementId: "G-HPWDXGTH63"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);
  const storage = getStorage(app);

  /**
 * Hook that responds to changes in network connectivity.
 *
 * When the network connection is lost, this hook disables network access
 * to the Firestore database. When the network is restored, it re-enables
 * network access.
 *
 * @param {Object} connectionStatus - The network connection status.
 * @param {boolean} connectionStatus.isConnected - Indicates whether the device is connected.
 */
  useEffect(() => { // if this value changes, the useEffect code will be re-executed
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!"); //if you lose connection while using the app, you should see a “Connection lost!” alert.
      disableNetwork(db); //disable attempts to reconnect to the Firestore Database by calling the Firestore function disableNetwork(db) when .isConnected is false
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  // Render the user interface
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen
          name="Chat"
        >
          {props => 
            <Chat 
              isConnected={connectionStatus.isConnected} 
              db={db} 
              storage={storage} 
              {...props} 
            />
          }
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
