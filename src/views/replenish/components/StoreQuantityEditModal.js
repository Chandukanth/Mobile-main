import Modal from "../../../components/Modal";
import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Color } from "../../../helper/Color";
import { verticalScale } from "../../../components/Metrics";
import Quantity from "../../../components/Quantity";
import QuantityButton from "../../../components/Quantity/index";

const StoreQuantityEditModal = ({ toggle, modalVisible, ConfirmationAction, quantityOnChange, quantity }) => {



    const modalHeader = (
        <View style={styles.modalHeader}>
            <Text style={styles.title}>Update Quantity</Text>
            <View style={styles.divider}></View>
        </View>
    )

    const modalBody = (
        <View style={styles.modalBody}>
            <QuantityButton quantity={quantity} quantityOnChange={quantityOnChange} />
        </View>
    )

    const modalFooter = (
        <View style={styles.modalFooter}>
            <View style={styles.divider} />
            <View style={{ flexDirection: "row", flex: 1 }}>

                <TouchableOpacity style={{ flex: 1, alignItems: 'center', backgroundColor: Color.PRIMARY, justifyContent: 'center', borderBottomLeftRadius: 5 }} onPress={ConfirmationAction}>
                    <Text style={styles.actionText}></Text>
                </TouchableOpacity>

            </View>
        </View>
    )

    return (
        <>
            <Modal
                title={"Update Quantity"}
                modalHeader={modalHeader}
                modalBody={modalBody}
                modalFooter={modalFooter}
                toggle={toggle}
                modalVisible={modalVisible}
                button1Label={"Update"}
                button1Press={ConfirmationAction}
            />
        </>
    )
}

export default StoreQuantityEditModal;


const styles = StyleSheet.create({
    modalHeader: {
        width: 300
    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
        padding: 15,
        color: Color.BLACK
    },
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "lightgray"
    },
    modalBody: {
        backgroundColor: "#fff",
        paddingVertical: 20,
        paddingHorizontal: 10,
        alignItems : "center"
    },
    modalFooter: {
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        height: verticalScale(40),
        backgroundColor: "#fff"
    },
    actions: {
        borderRadius: 5,
        marginHorizontal: 10,
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    actionText: {
        color: "#fff"

    }
});