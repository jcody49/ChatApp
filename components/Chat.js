import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import CustomActions from './CustomActions';   
import MapView from "react-native-maps";

// Firebase
import { collection, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";

// AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

//Define Chat component
const Chat = ({ db, route, navigation, isConnected, storage }) => {
    // Destructure the 'name' property from the 'route.params' object
    const { name, backgroundColor, userID } = route.params;

    // messages state initialization
    const [messages, setMessages] = useState([]);

    const loadCachedMessages = async () => {
        const cachedMessages = await AsyncStorage.getItem('messages') || '[]';
        setMessages(JSON.parse(cachedMessages));
    };

    let unsubMessages;

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
    
    const cacheMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
        } catch (error) {
            console.log(error.message);
        }
    }

    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0]);
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, newMessages)
        );
    };

    const renderInputToolbar = (props) => {
        if (isConnected) {
          return <InputToolbar {...props} />;
        } else {
          return null;
        }
    };
    

    //styling for chat bubbles
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

    const renderCustomActions = (props) => {
        return <CustomActions storage={storage} {...props} />; // The renderCustomActions function is responsible for creating the circle button
    };
    
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