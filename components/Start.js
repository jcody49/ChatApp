import React, { useState } from 'react';
import { getAuth, signInAnonymously } from "firebase/auth";

import { 
    StyleSheet, 
    View, 
    Text, 
    Button, 
    TextInput, 
    ImageBackground, 
    TouchableOpacity, 
    KeyboardAvoidingView,
    ScrollView,
    Alert, } from 'react-native';

    // Import an image as the background for the screen
const image = require('../images/Bg-Image.png');

// Define background color options
const backgroundColors = {
    a: '#D0E8F2', // A light blue background
    b: '#F3F2DA', // A cream-colored background
    c: '#D7BDE2', // A lavender background
    d: '#A9DFBF', // A mint green background
};

/**
 * Represents the start screen of the chat application.
 *
 * Allows users to enter their username and choose a background color before starting a chat session.
 *
 * @param {Object} navigation - The navigation object for screen navigation.
 */
const Start = ({ navigation }) => {
    
    // Define state variables using the 'useState' hook
    const [name, setName] = useState(''); //define name-setter function
    const [color, setColor] = useState(backgroundColors.a);
    
    const auth = getAuth();

    /**
   * Sign in the user anonymously and navigate to the Chat screen.
   *
   * Uses Firebase authentication to sign in the user anonymously. After signing in successfully,
   * navigates to the Chat screen and passes user information.
   */
    const signInUser = () => {
        signInAnonymously(auth)
        .then(result => { // app navigates to the Chat screen
        console.log("SIGNED IN", result);
        navigation.navigate("Chat", {userID: result.user.uid, name, backgroundColor: color }); // passing result.user.uid, name, and selected background color to chat screen
        Alert.alert("Signed in Successfully!");
        })
        .catch((error) => {
        Alert.alert("Unable to sign in, try later again.");
        })
    }




    return ( // returns start screen

        <ImageBackground
            source={image}
            resizeMode="cover"
            style={styles.image}
        > 
            <ScrollView contentContainerStyle={styles.container}> 
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <Text>
                    <Text style={styles.appTitle}>Chat App</Text>
                </Text>

                    <View style={styles.inputContainer}>

                        <TextInput
                            style={styles.textInput}
                            value={name}
                            onChangeText={setName}
                            placeholder='Type your username here'
                        />
                        <Text style={styles.textColorSelector}>Choose background color:</Text>
                        <View style={styles.colorSelector}>
                            <TouchableOpacity //interactive element that reduces opacity upon press
                                style={[
                                styles.circle, // Apply the circle style (shape and size)
                                color === backgroundColors.a && styles.selectedCircle, // Apply the selectedCircle style conditionally
                                { backgroundColor: backgroundColors.a }, // Set the background color to backgroundColors.a
                                ]}
                                onPress={() => setColor(backgroundColors.a)} // When pressed, update the color to backgroundColors.a
                            ></TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                styles.circle,
                                color === backgroundColors.b && styles.selectedCircle,
                                { backgroundColor: backgroundColors.b },
                                ]}
                                onPress={() => setColor(backgroundColors.b)}
                            ></TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                styles.circle,
                                color === backgroundColors.c && styles.selectedCircle,
                                { backgroundColor: backgroundColors.c },
                                ]}
                                onPress={() => setColor(backgroundColors.c)}
                            ></TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                styles.circle,
                                color === backgroundColors.d && styles.selectedCircle,
                                { backgroundColor: backgroundColors.d },
                                ]}
                                onPress={() => setColor(backgroundColors.d)}
                            ></TouchableOpacity> 
                        </View>
                        <TouchableOpacity style={styles.button} onPress={signInUser}>
                            <Text style={styles.buttonText}>Start Chatting</Text>
                        </TouchableOpacity>

                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </ImageBackground>
    );
};

/**
 * Styles for the Start component.
 *
 * @type {Object}
 * @property {number} container - Flex and alignment styles for the main container.
 * @property {number} image - Styles for the background image.
 * @property {number} appTitle - Styles for the app title.
 * @property {number} inputContainer - Styles for the input container.
 * @property {number} textInput - Styles for the text input field.
 * @property {number} textColorSelector - Styles for the text color selector.
 * @property {number} colorSelector - Styles for the background color selector.
 * @property {number} circle - Styles for the color selection circles.
 * @property {number} selectedCircle - Styles for the selected color circle.
 * @property {number} button - Styles for the "Start Chatting" button.
 * @property {number} buttonText - Styles for the button text.
 */
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    image: {
      flex: 1,
      justifyContent: 'space-between',
      padding: '6%',
    },
    appTitle: {
      fontSize: 45,
      fontWeight: '600',
      color: '#FFFFFF',
      alignSelf: 'center',
    },
    inputContainer: {
      backgroundColor: '#FFFFFF',
      padding: '6%',
      paddingBottom: 20,
    },
    textInput: {
      fontSize: 16,
      fontWeight: '300',
      color: '#757083',
      padding: 15,
      borderWidth: 1,
      borderColor: '#757083',
      marginTop: 15,
      marginBottom: 15,
    },
    textColorSelector: {
      fontSize: 16,
      fontWeight: '300',
      color: '#8A95A5',
      marginBottom: 10,
    },
    colorSelector: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    circle: {
      height: 50,
      width: 50,
      borderRadius: 25,
    },
    selectedCircle: {
      borderWidth: 2,
      borderColor: '#FF0000',
    },
    button: {
      backgroundColor: '#757083',
      padding: 10,
    },
    buttonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

export default Start;