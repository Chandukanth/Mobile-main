import React, { useEffect, useState } from "react";
import { Button, Image, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { Entypo } from '@expo/vector-icons';
import Layout from "../../../components/Layout";
import { useNavigation } from "@react-navigation/native";
import DoneButton from "../../../components/DoneButton";
import mediaService from "../../../services/MediaService";
import MediaList from "../../../components/MediaList";
import TabName from '../../../helper/Tab';
import Tab from "../../../components/Tab";
import NextButton from "../../../components/NextButton";
import { useForm } from "react-hook-form";





const Attachment = (props) => {
    const { prefillImage } = props;
    const [visible, setVisible] = useState(false);
    const [MediaData, setMediaData] = useState([]);
    const [images, setImages] = useState([]);
    const [ids, setIds] = useState();
    const [isImageLoaded, setIsImageLoaded] = useState();

    const params = props?.route?.params;

    useEffect(() => {
        getMediaList();
    }, [])

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
    });
    const getMediaList = async () => {
        await mediaService.search(params.id, params.object, callback => setMediaData(callback.data.data))

    }




    const hideMenu = () => setVisible(false);
    const showMenu = (e) => {
        setVisible(true)
    };
    const navigation = useNavigation();
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);

    async function dataURItoBlob(data) {
        const response = await fetch(data);
        const blob = await response.blob();
        if (blob) {
            setFile(blob);
        }
    }

    const uploadImage = (file, image) => {
        if (file) {
            const data = new FormData();
            let files = {
                type: file?._data?.type,
                size: file?._data.size,
                uri: image,
                name: file?._data.name,
            };
            data.append("media_file", files);
            data.append("media_name", file?._data.name);
            data.append("object", "SALE_SETTLEMENT");
            data.append("object_id", props?.route?.params?.id);
            data.append("media_visibility", 1);

            let mediaObj = [{
                url: image
            }];

            if (MediaData && MediaData.length > 0) {
                let updatedMediaList = [...mediaObj, ...MediaData]
                setMediaData(updatedMediaList);
            } else {
                setMediaData(mediaObj)
            }


            mediaService.uploadMedia(navigation, data, async (error, response) => {
                let id = response?.id
                setIds(id)
                if (response) {
                    getMediaList()
                }
            });
        }
    };


    const removeImage = () => {
        if (ids) {
            mediaService.deleteMedia(ids, (error, response) => {
                getMediaList();
            });
        }

    }


    const takePicture = async () => {

        let permission = await ImagePicker.requestCameraPermissionsAsync()

        let mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permission && permission.status == 'granted' && mediaPermission && mediaPermission.status == 'granted') {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
            });


            if (result && result.assets && result.assets.length > 0 && result.assets[0].uri) {
                const response = await fetch(result.assets[0].uri);
                if (response) {
                    const blob = await response.blob();
                    setFile(blob)


                    if (!result.canceled) {
                        setImage(result.assets[0].uri);
                        addNewEntry(blob, result.assets[0].uri);
                        setImages([...images, { uri: result.assets[0].uri }]);

                    }
                }
            }
        }
    }

    const addNewEntry = async (file, image) => {
        await uploadImage(file, image)
    }

    return (

        <Layout
            title="Report"
            showBackIcon={true}
            buttonOnPress={(e) =>takePicture(e) }
            buttonLabel={"Upload"}
            backButtonNavigationUrl={"SalesSettlement"}
            FooterContent={<NextButton  onPress={() => {
                navigation.navigate("MediaUpload",params);
            }}/>  }
        >

            
            <MediaList
                mediaData={MediaData}
                getMediaList={getMediaList}
            />
        </Layout >

    );
};
export default Attachment;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: "scroll",
        backgroundColor: "#fff",
    },
  
    tabBar: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
   
});

