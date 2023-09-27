import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Chat = ({ route, navigation }) => {
    // Destructure the 'name' property from the 'route.params' object
    const { name } = route.params;

    useEffect(() => {
        // Update the title in the navigation header with the 'name' value
        navigation.setOptions({ title: name });
    }, []); // The empty array '[]' means this effect runs once, when the component mounts

    return (
        // Return a view that displays a text message
        <View style={styles.container}>
            <Text>Chat Screen!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   justifyContent: 'center', // Vertically align content to the center
   alignItems: 'center' // Horizontally align content to the center
 }
});

export default Chat;