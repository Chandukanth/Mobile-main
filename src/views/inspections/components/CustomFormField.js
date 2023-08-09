// Import React and Component
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import NoRecordFound from "../../../components/NoRecordFound";
import DatePicker from "../../../components/DatePicker";
import Currency from "../../../components/Currency";
import CustomFormField from "../../../helper/CustomForm";
import FileUpload from "../../../components/FileUpload";
import Label from "../../../components/Label";
import MediaService from "../../../services/MediaService";
import { useNavigation } from "@react-navigation/native";
import ObjectName from "../../../helper/ObjectName";
import DeleteConfirmationModal from "../../../components/Modal/DeleteConfirmationModal";
import TextInput from "../../../components/TextInput";
import TextArea from "../../../components/TextArea";
import StoreSelect from "../../../components/StoreSelect";
import VerticalSpace10 from "../../../components/VerticleSpace10";

const Forms = ({ selectedDates, control, setUploadedImages, uploadedImages, customFormFieldList, inspectionId }) => {

    const [purchaseDeleteModalOpen, setPurchaseDeleteModalOpen] = useState(false);

    const [ImageIsUploading, setImageIsUploading] = useState([]);

    const [selectedItem, setSelectedItem] = useState("");

    const navigation = useNavigation();

    const onPressRemove = () => {
        if (selectedItem && selectedItem.value) {
            MediaService.deleteMedia(selectedItem.value, () => {
                if (uploadedImages && uploadedImages.length > 0) {
                    let updatedArray = [...uploadedImages];
                    const index = updatedArray.findIndex((element) => element.value == selectedItem.value);
                    updatedArray[index].value = "";
                    updatedArray[index].mediaUrl = "";
                    setUploadedImages(updatedArray);
                }
            })
        }
    }

    const uploadImage = (file, imageLocalUrl, callback) => {

        if (file) {

            const data = new FormData();

            let mediaFile = {
                type: file?._data?.type,
                size: file?._data.size,
                uri: imageLocalUrl,
                name: file?._data.name
            }

            data.append("media_file", mediaFile)

            data.append("image_name", file?._data.name);

            data.append("name", file?._data.name);

            data.append("media_name", file?._data.name);

            data.append("object", ObjectName.INSPECTION);

            data.append("object_id", inspectionId)

            data.append("media_url", imageLocalUrl);

            data.append("media_visibility", 1);

            data.append("feature", 1);

            MediaService.uploadMedia(navigation, data, async (error, response) => {

                return callback(response);

            })
        } else {
        }
    }

    const getSelectedFile = id => {
        try {
            let images = uploadedImages;

            if (images && images.length > 0) {

                let media = images.find(data => data.fieldId == id);

                return media ? media : null;
            }
            return null;
        } catch (err) {
            console.log(err);
        }
    };

    const onSelectMediaFile = (id, mediaId, mediaUrl) => {
        try {
            let images = [...uploadedImages];

            if (images && images.length > 0) {

                let index = images.findIndex(data => data.fieldId == id);

                if (index > -1) {
                    images[index].value = mediaId ? mediaId : null;
                    images[index].mediaUrl = mediaUrl ? mediaUrl : null;
                    setUploadedImages(images)
                } else {
                    images.push({ fieldId: id, value: mediaId ? mediaId : null, mediaUrl: mediaUrl });
                    setUploadedImages(images)
                }
            } else {
                images.push({ fieldId: id, value: mediaId ? mediaId : null, mediaUrl: mediaUrl });
                setUploadedImages(images)
            }
        } catch (err) {
            console.log(err);
        }
    };

    const onPictureCapture = (id, image, imageLocalUrl) => {

        let imageIsUploading = [...ImageIsUploading];

        imageIsUploading.push({ id: id });

        setImageIsUploading(imageIsUploading);

        uploadImage(image, imageLocalUrl, (response) => {
            if (response) {
                onSelectMediaFile(id, response.id, response.mediaUrl)
            }
            setImageIsUploading([]);
        })
    }

    const purchaseDeleteModalToggle = () => {
        setPurchaseDeleteModalOpen(!purchaseDeleteModalOpen);
        setSelectedItem("");
    }

    return (
        <>

            <DeleteConfirmationModal
                modalVisible={purchaseDeleteModalOpen}
                toggle={purchaseDeleteModalToggle}
                updateAction={onPressRemove}
                bottomToolBar={true}
                id={selectedItem?.value}
            />

            {customFormFieldList && customFormFieldList.length > 0 ? (

                customFormFieldList.map((item, index) => {


                    let mediaDetail = getSelectedFile(item.id);

                    let selectedDate = selectedDates && selectedDates.length > 0 && selectedDates.find((data) => data.id == item.id);

                    let imageIsUploading = ImageIsUploading && ImageIsUploading.length > 0 && ImageIsUploading.find((data) => data.id == item.id);

                    return (
                        <>
                            {item.type == CustomFormField.TYPE_CURRENCY && (
                                <>
                                    <VerticalSpace10  />

                                    <Currency
                                        title={item.name}
                                        name={`${item.id}`}
                                        control={control}
                                        edit
                                    />
                                </>
                            )}

                            {item.type == CustomFormField.TYPE_DATE && (
                                <>
                                    <VerticalSpace10  />

                                    <DatePicker
                                        selectedDate={selectedDate ? selectedDate.value : ""}
                                        control={control}
                                        title={item.name}
                                        isForm={true}
                                        name={`${item.id}`}
                                    />
                                </>
                            )}

                            {item.type == CustomFormField.TYPE_FILE_UPLOAD && (
                                <View style={mediaDetail && mediaDetail.mediaUrl ? { marginTop: 10 } : { flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>

                                    <Label text={item.name} fontWeight={`600`} size={13} />

                                    <FileUpload
                                        image={mediaDetail ? mediaDetail.mediaUrl : null}
                                        customCameraIconWith={50}
                                        isImageLoading={imageIsUploading ? true : false}
                                        customCameraCircleHeight={100}
                                        customCameraCircleWidth={100}
                                        profileImage={false}
                                        onPressRemove={() => {
                                            setSelectedItem(mediaDetail);
                                            setPurchaseDeleteModalOpen(true)
                                        }}
                                        onImageCapture={(selectedImage, imageUrl) => onPictureCapture(item.id, selectedImage, imageUrl)}
                                        showTakePhotoButton={true}
                                    />
                                </View>
                            )}

                            {item.type == CustomFormField.TYPE_TEXT && (
                                <>
                                    <VerticalSpace10  />

                                    <TextInput
                                        title={item.name}
                                        name={`${item.id}`}
                                        control={control}
                                    />
                                </>
                            )}

                            {item.type == CustomFormField.TYPE_TEXT_AREA && (
                                <>
                                    <VerticalSpace10  />

                                    <TextArea
                                        title={item.name}
                                        name={`${item.id}`}
                                        control={control}
                                    />
                                </>
                            )}

                            {item.type == CustomFormField.TYPE_STORE_SELECT && (
                                <>

                                    <VerticalSpace10  />

                                    <StoreSelect
                                        label={item.name}
                                        name={`${item.id}`}
                                        control={control}
                                    />
                                </>
                            )}

                        </>
                    );
                })
            ) : (
                <NoRecordFound message="Add Fields" iconName="receipt" styles={{ paddingVertical: 250, alignItems: "center" }} />
            )}
        </>
    );
};

export default Forms;

const styles = StyleSheet.create({
    align: {
        alignItems: "flex-start",
        paddingBottom: 10,
        paddingTop: 10,
    },
    input: {
        color: "black",
        height: 50,
        width: "100%",
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#dadae8",
    },
})
