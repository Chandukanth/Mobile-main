
import React from 'react';

import { Modal, View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';

import { verticalScale } from "../Metrics";

import { MaterialIcons } from "@expo/vector-icons";
import { Color } from '../../helper/Color';

function TransferTypeReasonSelectModal({ toggle, modalVisible, onPress, transferTypeReasonList }) {


    return (
        <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                toggle && toggle();
            }}>
            <View style={styles.container}>

                <View style={styles.modalContainer}>

                    <View style={styles.modalHeader}>
                        <Text style={styles.title}>Select Reason </Text>
                    </View>

                    <View style={styles.divider}></View>

                    <View style={styles.modalBody}>

                        <FlatList
                            data={transferTypeReasonList}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity
                                        style={[
                                            styles.card,
                                        ]}
                                        onPress={() => onPress && onPress(item)}
                                    >
                                        <View style={{flex: 0.9, fontWeight: "500", fontSize: 16, color: "gray"}}>
                                            <Text>{item.name}</Text>
                                        </View>
                                        <View style={{flex: 0.1}}>
                                            <MaterialIcons name="chevron-right" size={30} color="gray" />
                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default TransferTypeReasonSelectModal;

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#00000099",
    },
    modalContainer: {
        width: "80%",
        height: verticalScale(400),
        borderRadius: 5,
        backgroundColor: "#f9fafb",
    },
    modalHeader: {
        flex: 0.2,
        justifyContent: "center",
    },
    modalBody: {
        flex: 0.6,
        backgroundColor: "#fff",
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
        padding: 15,
        color:Color.BLACK
    },
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "lightgray"
    },
    card: {
        alignItems: "center",
        backgroundColor: "#fff",
        flexDirection: "row",
        paddingVertical: 10,
        flex: 1,
    },
    cartText: {
        fontSize: 16,
        textTransform: "capitalize",
    },

});