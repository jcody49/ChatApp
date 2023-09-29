import React, { useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import Start from './components/Start';
import Chat from './components/Chat';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const Stack = createNativeStackNavigator();

import { LogBox, Alert } from 'react-native';
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

//const image = require('./images/Background Image.png'); // Declares the image variable here
const App = () => {

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
          {props => <Chat db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 42,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000c0',
  },
});

export default App;
