import React from "react";
import { Button, Image, View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Color } from "../helper/Color";
import Spinner from "../components/Spinner";


const FileUpload = (props) => {
  const {
    image,
    setImage,
    prefillImage,
    setFile,
    customCameraIconWith,
    customCameraCircleHeight,
    customCameraCircleWidth,
    profileImage = true,
    onPressRemove,
    onImageCapture,
    delay = 500,
    showTakePhotoButton,
    isImageLoading
  } = props;

  let timeoutId;

  //convert bast64 inti binary
  async function dataURItoBlob(data) {
    const response = await fetch(data);
    const blob = await response.blob();
    if (blob) {
      setFile && setFile(blob);
      onImageCapture && onImageCapture(blob, data);
    }
  }


  const takePicture = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.canceled) {
      setImage && setImage(result.assets[0].uri);
    }

    dataURItoBlob(result.assets[0].uri);
  }

  const handlePressIn = () => {
    timeoutId = setTimeout(() => {
      onPressRemove();
    }, delay);
  };

  const handlePressOut = () => {
    clearTimeout(timeoutId);
  };

  return (
    <View
      style={{
        paddingVertical: 20,
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <View>
        <TouchableOpacity onPress={takePicture}>
          {image || prefillImage ? (
            <>
              {profileImage ? (
                <Image
                  source={{ uri: image ? image : prefillImage }}
                  style={{ height: 150, width: 150, borderRadius: 400 / 2 }}
                />
              ) : (
                <View style={styles.container}>
                  <TouchableWithoutFeedback
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                  >
                    <Image source={{ uri: image ? image : prefillImage }} style={styles.image} />
                  </TouchableWithoutFeedback>
                </View>
              )}
            </>
          ) : (
            <>
              {showTakePhotoButton ? (
                <>
                  {isImageLoading ? (
                    <Spinner />
                  ) : (
                    <Button
                      title={"Take Photo"}
                      color={Color.BLACK}
                      onPress={() => takePicture()}
                    />
                  )}
                </>
              ) : (
                <View
                  style={{
                    alignItems: "center",
                    backgroundColor: Color.PRIMARY,
                    flex: 1,
                    height: customCameraCircleHeight ? customCameraCircleHeight : 150,
                    width: customCameraCircleWidth ? customCameraCircleWidth : 150,
                    borderRadius: 400 / 2,
                  }}
                >
                  <View style={{ marginTop: 20 }}>
                    <Ionicons
                      name="md-camera-outline"
                      size={customCameraIconWith ? customCameraIconWith : 100}
                      borderRadius={5}
                      color="white"
                    />
                  </View>

                </View>
              )}
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default FileUpload;


const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    width: 350, // Adjust the size as needed
    height: 250, // Adjust the size as needed
  },
  closeIconContainer: {
    position: 'absolute',
    top: 1, // Adjust the distance from the top as needed
    right: 1, // Adjust the distance from the right as needed
  },
});

