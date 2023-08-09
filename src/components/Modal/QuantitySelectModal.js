import Modal from "../Modal";
import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, Alert, StyleSheet } from 'react-native';
import Select from "../Select";
import { Color } from "../../helper/Color";
import { verticalScale } from "../Metrics";
import { useForm } from "react-hook-form";
import Quantity from "../Quantity";

const QuantitySelectModal = ({ toggle, modalVisible, ConfirmationAction, Numbers, onChange, value }) => {

    let preloadedValues = { label: `${value}`, value: `${value}` };

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const modalHeader = (
        <View style={styles.modalHeader}>
            <Text style={styles.title}>Update Quantity</Text>
            <View style={styles.divider}></View>
        </View>
    )

    const modalBody = (
        <View style={styles.modalBody}>
            <Quantity
                Numbers={Numbers}
                control={control}
                onChange={onChange}
                preloadedValues={preloadedValues}
            />
        </View>
    )

    const modalFooter = (
        <View style={styles.modalFooter}>
            <View style={styles.divider} />
            <View style={{ flexDirection: "row", flex: 1 }}>

                <TouchableOpacity style={{ flex: 1, alignItems: 'center', backgroundColor: Color.PRIMARY, justifyContent: 'center', borderBottomLeftRadius: 5 }} onPress={() => ConfirmationAction && ConfirmationAction()}>
                    <Text style={styles.actionText}></Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ flex: 1, alignItems: 'center', backgroundColor: Color.SECONDARY, justifyContent: 'center', borderBottomRightRadius: 5 }}
                    onPress={() => {
                        toggle();
                    }}>
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
                button1Press={ConfirmationAction()} 
                button2Label={"Cancel"} 
                button2Press={toggle()}
            />
        </>
    )
}

export default QuantitySelectModal;


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
        paddingHorizontal: 10
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