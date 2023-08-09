import React, { useState, useEffect } from 'react';

import { StyleSheet, Text, View, Button, Image } from 'react-native';
import ActionBarButton from './ActionBarButton';
import { Camera } from 'expo-camera';
import { Color } from '../helper/Color';

function CameraScreen({ getImageUrl, showFront }) {

    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [image, setImage] = useState(null);
    const [type, setType] = useState(showFront ? Camera.Constants.Type.front : Camera.Constants.Type.back);
    const [imageData, setImageData] = useState(false);

    useEffect(() => {
        // setImage(null);
        (async () => {
            const cameraStatus = await Camera.requestPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        if (camera) {
            try {
                const data = await camera.takePictureAsync({ base64: true })

                const imageData = await camera.takePictureAsync(null)

                setImage(imageData.uri);

                setImageData(data);

            } catch (err) {
                console.log(err);
            }
        }
    }

    const CheckIn = () => {
        getImageUrl(imageData, setImage)
    }
    const Retake = () => {
        setImage(null);
        setImageData(null);
    }

    if (hasCameraPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return (
        <View style={{ flex: 1 }}>
            {!image && (
                <View style={styles.cameraContainer}>
                    <Camera
                        ref={ref => setCamera(ref)}
                        style={styles.fixedRatio}
                        type={type}
                        ratio={'1:1'} />
                </View>
            )}

            {!image ? (
                <ActionBarButton title="Done" onPress={() => takePicture()} />
            ) : (
                <View style={{ display: "flex", flex: 1, flexDirection: "column" }}>
                    <View style={{ flex: 0.9 }}>
                        {image && <Image source={{ uri: image }} style={{ flex: 1 }} />}
                    </View>

                    <View style={{ flex: 0.1, marginTop: 10 }}>
                        <View style={{ display: "flex", flex: 1, flexDirection: "row" }}>
                            <View style={{ flex: 0.5 }}>
                                <ActionBarButton title="Check In" onPress={() => CheckIn()} />
                            </View>
                            <View style={{ flex: 0.5 }}>
                                <ActionBarButton title="Retake" onPress={() => Retake()} />
                            </View>
                        </View>
                    </View>
                </View>

            )}

        </View>
    );
}

export default CameraScreen;

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 0.8
    }
})