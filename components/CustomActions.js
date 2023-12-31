import React from 'react'; // Import React
import { TouchableOpacity, Text, View, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { getStorage, getDownloadURL, uploadBytes, ref } from "firebase/storage";

/**
 * Represents a custom actions component for chat messages.
 *
 * @param {Object} props - The component's props.
 * @param {Object} props.wrapperStyle - Custom styles for the component wrapper.
 * @param {Object} props.iconTextStyle - Custom styles for the icon text.
 * @param {Function} props.onSend - Callback function to handle sending messages.
 * @param {Object} props.storage - Firebase Storage reference.
 * @param {string} props.userID - The user's ID.
 */
const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {
  // Use the useActionSheet hook inside a functional component
  const { showActionSheetWithOptions } = useActionSheet();

  /**
   * Handles the action button press and displays available options.
   */
  const onActionPress = () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            return;
          case 1:
            takePhoto();
            return;
          case 2:
            getLocation();
            return;
          default:
        }
      }
    );
  };

  /**
   * Generates a unique reference for the uploaded image in Firebase Storage.
   *
   * @param {string} uri - The image's URI.
   * @returns {string} The unique reference string.
   */
  const generateReference = (uri) => {
    const timeStamp = (new Date()).getTime();
    const imageName = uri.split("/")[uri.split("/").length - 1];
    return `${userID}-${timeStamp}-${imageName}`; // represents the picked image’s URI.
  }

  /**
   * Uploads the selected image and sends it in a chat message.
   *
   * @param {string} imageURI - The URI of the selected image.
   */
  const uploadAndSendImage = async (imageURI) => {
    const uniqueRefString = generateReference(imageURI);
    const newUploadRef = ref(storage, uniqueRefString);
    const response = await fetch(imageURI);
    const blob = await response.blob();
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      const imageURL = await getDownloadURL(snapshot.ref)
      onSend({ image: imageURL })
    });
  }

  /**
   * Handles picking an image from the device's library.
   */
  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      else Alert.alert("Permissions haven't been granted.");
    }
  }

  /**
   * Handles taking a photo using the device's camera.
   */
  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      else Alert.alert("Permissions haven't been granted.");
    }
  }

  /**
   * Handles fetching the user's current location and sending it in a chat message.
   */
  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();
    if (permissions?.granted) {
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        onSend({
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        });
      } else Alert.alert("Error occurred while fetching location");
    } else Alert.alert("Permissions haven't been granted.");
  };

  /**
   * Renders the custom action button component.
   *
   * @returns {JSX.Element} The custom action button component.
   */
  return (
    <TouchableOpacity style={styles.container} onPress={onActionPress}>
      {/* passing these props to the custom component you’re trying to create and return in the renderCustomActions() function of Chat.js */}
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 10,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

export default CustomActions;
