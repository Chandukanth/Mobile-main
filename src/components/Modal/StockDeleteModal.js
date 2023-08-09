import React from 'react';

import { Modal, View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { Color } from '../../helper/Color';

import { verticalScale } from "../Metrics";

import ProductCard from '../ProductCard';

import AlertMessage from '../../helper/AlertMessage';

function StockDeleteModal({ toggle, modalVisible, CancelAction, item, updateAction, transfer, id }) {
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
                        <Text style={styles.title}>Confirm Delete</Text>
                    </View>

                    <View style={styles.divider}></View>



                    <View style={styles.modalBody}>
                        <View style={{ paddingHorizontal: 10 }}>
                            {transfer ? <Text> Are you sure want to delete transfer Id #{item.transfer_number} ?</Text> : <Text>{AlertMessage.DELETE_MODAL_DESCRIPTION}</Text>}
                        </View>
                        <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
                            {!transfer && <Text style={{ fontSize: 20 }}>#{item?.stock_entry_number}  {item?.store}</Text>}
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.modalFooter}>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <TouchableOpacity style={{ flex: 0.5, alignItems: 'center', backgroundColor: Color.PRIMARY, justifyContent: 'center', borderBottomLeftRadius: 5 }} onPress={() => {
                                toggle && toggle();
                                updateAction && updateAction(item.inventoryTransferProductId);
                            }}>
                                <Text style={{ color: Color.PRIMARY_TEXT, fontSize: 15, fontWeight: "700" }}>Ok</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flex: 0.5, alignItems: 'center', backgroundColor: Color.SECONDARY_BUTTON, justifyContent: 'center', borderBottomRightRadius: 4.7 }} onPress={() => {
                                toggle && toggle();
                                CancelAction && CancelAction();
                            }} >
                                <Text style={{ color: Color.PRIMARY_BUTTON, fontSize: 15, fontWeight: "700" }}>CANCEL</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </View>
            </View>
        </Modal>
    );
}

export default StockDeleteModal;

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
        height: verticalScale(300),
        borderRadius: 5,
        flex: 0.3,
        backgroundColor: "#f9fafb",
    },
    modalHeader: {
        flex: 0.2,
        justifyContent: "center",
    },
    modalBody: {
        flex: 0.6,
        backgroundColor: "#fff",
        paddingVertical: 5,
        // paddingHorizontal: 10,
        justifyContent: "center",
        // alignItems: "center"
    },
    modalFooter: {
        flex: 0.2,
    },
    title: {
        fontWeight: "bold",
        // fontSize: 15,
        paddingHorizontal: 15,
        color:Color.BLACK
    },
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "lightgray"
    },
    actions: {
        borderRadius: 5,
        marginHorizontal: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#db2828"
    },
    actionText: {
        color: "#fff"
    },
    imageStyle: {
        flex: 1,
        flexDirection: "row"
    }
});