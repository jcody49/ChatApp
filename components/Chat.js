import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import CustomActions from './CustomActions';   
import MapView from "react-native-maps";

// Firebase
import { collection, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";

// AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Represents a chat component.
 *
 * @param {Object} props - The component's props.
 * @param {Object} props.db - Firebase Firestore database reference.
 * @param {Object} props.route - The route object containing navigation parameters.
 * @param {Object} props.navigation - Navigation object for routing.
 * @param {boolean} props.isConnected - Indicates the user's internet connection status.
 * @param {Object} props.storage - Firebase Storage reference.
 */
const Chat = ({ db, route, navigation, isConnected, storage }) => {
    // Destructure the 'name' property from the 'route.params' object
    const { name, backgroundColor, userID } = route.params;

    // messages state initialization
    const [messages, setMessages] = useState([]);

    /**
     * Loads cached chat messages from AsyncStorage.
     */
    const loadCachedMessages = async () => {
        const cachedMessages = await AsyncStorage.getItem('messages') || '[]';
        setMessages(JSON.parse(cachedMessages));
    };

    let unsubMessages;
    /**
     * Handles Firebase Firestore listener for new chat messages and caches them.
     */
    useEffect(() => {

        navigation.setOptions({ title: name });

        if (isConnected === true) {
          // unregister current onSnapshot() listener to avoid registering multiple listeners when
          // useEffect code is re-executed.
          if (unsubMessages) unsubMessages();
          unsubMessages = null; // call onSnapshot’s unsubscribe function and set its reference to null before calling onSnapshot() itself
    
          const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
          unsubMessages = onSnapshot(q, (documentsSnapshot) => {
            let newMessages = [];
            documentsSnapshot.forEach((doc) => {
              newMessages.push({ 
                    id: doc.id, 
                    ...doc.data(), 
                    createdAt: new Date(doc.data().createdAt.toMillis()), 
                });
            });
            cacheMessages(newMessages);
            setMessages(newMessages);
          });
        } else loadCachedMessages();
    
        // Clean up code
        return () => {
          if (unsubMessages) unsubMessages();
        };
    }, [isConnected]);
    
    /**
     * Caches chat messages using AsyncStorage.
     *
     * @param {Object[]} messagesToCache - The messages to cache.
     */
    const cacheMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
        } catch (error) {
            console.log(error.message);
        }
    }

    /**
     * Sends new chat messages to Firebase Firestore and updates the state.
     *
     * @param {Object[]} newMessages - The new chat messages to send.
     */
    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0]);
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, newMessages)
        );
    };

    /**
     * Renders the input toolbar based on the user's internet connection status.
     *
     * @param {Object} props - The input toolbar component's props.
     * @returns {JSX.Element} The input toolbar component.
     */
    const renderInputToolbar = (props) => {
        if (isConnected) {
          return <InputToolbar {...props} />;
        } else {
          return null;
        }
    };
    

    /**
     * Renders chat message bubbles with custom styling.
     *
     * @param {Object} props - The chat bubble component's props.
     * @returns {JSX.Element} The styled chat bubble component.
     */
    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: "#000",
                    },
                    left: {
                        backgroundColor: "#FFF",
                    },
                }}
            />
        );
    };

    /**
     * Renders the custom actions component for sending images and locations.
     *
     * @param {Object} props - The custom actions component's props.
     * @returns {JSX.Element} The custom actions component.
     */
    const renderCustomActions = (props) => {
        return <CustomActions storage={storage} {...props} />; // The renderCustomActions function is responsible for creating the circle button
    };
    
    /**
     * Renders a custom view for location messages, displaying a map.
     *
     * @param {Object} props - The custom view component's props.
     * @returns {JSX.Element} The custom view component.
     */
    const renderCustomView = (props) => {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
                    region={{
                    latitude: currentMessage.location.latitude,
                    longitude: currentMessage.location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    };

    /**
     * Renders the chat component's user interface.
     *
     * @returns {JSX.Element} The chat component's user interface.
     */
    return (
        <View style={[styles.container, { backgroundColor: backgroundColor }]}>
          <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            renderBubble={renderBubble}
            renderInputToolbar={renderInputToolbar}
            renderActions={renderCustomActions}
            renderCustomView={renderCustomView}
            user={{
              _id: userID,
              name: name,
            }}
        />
        {Platform.OS === "android" ? ( // conditionally renders keyboard lower than the view for older systems
        <KeyboardAvoidingView behavior="height" />
        ) : null}
        {Platform.OS === "ios" ? (
            <KeyboardAvoidingView behavior="padding" />
        ) : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
});

export default Chat;