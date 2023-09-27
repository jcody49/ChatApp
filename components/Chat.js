import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";


    

const Chat = ({ route, navigation }) => {
    // Destructure the 'name' property from the 'route.params' object
    const { name } = route.params;

    // messages state initialization
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Set the initial messages state with a static message
        setMessages([
            {
                _id: 1,
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                  _id: 2,
                  name: 'React Native',
                  avatar: 'https://placeimg.com/140/140/any',
                },
              },
              {
                _id: 2,
                text: 'This is a system message',
                createdAt: new Date(),
                system: true,
            },
        ]);
    }, []); // The empty array '[]' means this effect runs once, when the component mounts

    const onSend = (newMessages) => { // appends new messages to previous messages
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
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
        <View style={[styles.container]}>
          <GiftedChat
            messages={messages}

            onSend={messages => onSend(messages)}
            renderBubble={renderBubble}

            user={{
              _id: 1,
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