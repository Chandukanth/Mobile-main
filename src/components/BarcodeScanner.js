import React from 'react';

import { Modal, View, StyleSheet, Text, Button } from 'react-native';

import Scanner from "./barcodeScanner";

import { verticalScale } from './Metrics'
import { Color } from '../helper/Color';

function BarcodeScanner({ toggle, modalVisible, CancelAction, handleScannedData, title }) {

    return (
        <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                toggle && toggle();
            }}>
            <View style={styles.container}>

                <View style={styles.modalContainer}>

                    {title && (
                        <>
                            <View style={styles.modalHeader}>
                                <Text style={styles.title}>{title}</Text>
                            </View>
                            <View style={styles.divider}></View>
                        </>
                    )}

                    <View style={styles.modalBody}>
                        <Scanner height="106%" onScan={handleScannedData} />
                    </View>

                    {title && (
                        <View style={styles.divider} />
                    )}

                    <View style={title ? styles.modalFooter :styles.cancelFooter}>

                        <Button title={"Cancel"} color="black" onPress={() => {
                            toggle();
                            CancelAction && CancelAction();
                        }} />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default BarcodeScanner;

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:Color.BARCODE,
    },
    modalContainer: {
        width: "100%",
        // minWidth: "50%",
        height: "100%",
        borderRadius: 5,
        backgroundColor: "#f9fafb",
    },
    modalHeader: {
        flex: 0.2,
        justifyContent: "center",
    },
    modalBody: {
        flex: 1,
        backgroundColor: "#fff",
        paddingVertical: 20,
        // paddingHorizontal: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    modalFooter: {
        flex:0.12,
        padding: 5
    },
    cancelFooter: {
        flex:0.05,
    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
        padding: 15,
        color: "#000"
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
});