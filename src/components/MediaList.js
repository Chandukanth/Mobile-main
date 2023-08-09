import { FontAwesome5 } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DeleteModal from "../components/Modal/DeleteConfirmationModal";
import { Color } from "../helper/Color";
import mediaService from "../services/MediaService";
import MediaCard from "../views/Purchase/components/MediaCard";

const Media = (props) => {
    const { mediaData, getMediaList } = props;
    const [selectedItem, setSelectedItem] = useState("");
    const [mediaDeleteModal, setMediaDeleModal] = useState(false)
    const stateRef = useRef();

    const removeImage = (id) => {
        if (id) {
            mediaService.deleteMedia(id, (error, response) => {
                getMediaList();
            });
        }
    }

    const clearRowDetail = () => {
        if (stateRef) {
            const selectedItem = stateRef.selectedItem;
            const selectedRowMap = stateRef.selecredRowMap;
            if (selectedItem && selectedRowMap) {
                closeRow(selectedRowMap, selectedItem.inventoryTransferProductId)
                setSelectedItem("");
                stateRef.selectedItem = "";
                stateRef.selecredRowMap = "";
            }
        }
    }
    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    }
    const mediaDeleteToggle = () => {
        setMediaDeleModal(!mediaDeleteModal);
        clearRowDetail();
    }
  


    return (

        <>
            <DeleteModal
                modalVisible={mediaDeleteModal}
                toggle={mediaDeleteToggle}
                updateAction={() => removeImage(selectedItem?.id)}
                id={selectedItem?.id}
            />
            {mediaData && mediaData.length > 0 ?
                <MediaCard
                    mediaData={mediaData}
                />
                : (
                    <View style={{ paddingVertical: 250, alignItems: "center" }}>
                        <FontAwesome5 name="receipt" size={20} color={Color.PRIMARY} />
                        <Text style={{ fontWeight: "bold" }}>No Records Found</Text>
                    </View>
                )}

        </>
    );
};
export default Media;
const styles = StyleSheet.create({
    swipeStyle: {
        flex: 1,

    },
    actionDeleteButton: {
        alignItems: 'center',
        bottom: 10,
        justifyContent: 'center',
        position: 'absolute',
        top: 16,
        width: 70,
        backgroundColor: '#D11A2A',
        right: 7
    },
    btnText: {
        color: Color.WHITE,
    },

})