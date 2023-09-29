import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
    
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

const Chat = ({ db, route, navigation }) => {
    // Destructure the 'name' property from the 'route.params' object
    const { name, backgroundColor, userID } = route.params;

    // messages state initialization
    const [messages, setMessages] = useState([]);

    let unsubMessages;

    useEffect(() => {
        navigation.setOptions({ title: name });

        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        const unsubMessages = onSnapshot(q, (documentsSnapshot) => {
            let newMessages = [];
            documentsSnapshot.forEach(doc => {
                newMessages.push({ 
                    id: doc.id, 
                    ...doc.data(), 
                    createdAt: new Date(doc.data().createdAt.toMillis()) 
                })
            })
            setMessages(newMessages);
        })
    
        return () => {
        if (unsubMessages) unsubMessages();
        }
    }, []); // The empty array '[]' means this effect runs once, when the component mounts

    const onSend = (newMessages) => {
        console.log("New Message Data:", newMessages[0]);
        addDoc(collection(db, "messages"), newMessages[0])
    }

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

    return (
        <View style={[styles.container, { backgroundColor: backgroundColor }]}>
          <GiftedChat
            messages={messages}

            onSend={messages => onSend(messages)}
            renderBubble={renderBubble}

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