import React, { useState } from "react";
import { Button, Image, View, TouchableOpacity, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Color } from "../../helper/Color";
const FileUpload = (props) => {
  const { image, setImage, prefillImage, setFile } = props;
  const [open,setOpen] = useState(false)

  //convert bast64 inti binary
  async function dataURItoBlob(data) {
    const response = await fetch(data);
    const blob = await response.blob();
    if (blob) {
      setFile(blob);
    }
  }


  const takePicture = async () => {
    setOpen(true)
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }

    dataURItoBlob(result.assets[0].uri);
    setOpen(false)
  }
  return (
    <View
      style={{
        paddingVertical: 20,
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      {/* <View style={{paddingLeft:150}}>{!image &&<Button title="UploadImage" onPress={takePicture} />}</View> */}
      <View>
        <TouchableOpacity onPress={takePicture}>
          {image || prefillImage ? (
            <Image
              source={{ uri: image ? image : prefillImage }}
              style={{ height: 150, width: 150, borderRadius: 400 / 2 }}
            />
          ) : (
            <View>
              <View style={{ marginTop: 20 }}>
                <Ionicons
                  name="md-camera-outline"
                  size={100}
                  borderRadius={5}
                />
              </View>

            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default FileUpload;
