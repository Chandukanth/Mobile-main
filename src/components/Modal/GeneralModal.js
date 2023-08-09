import React, { useState } from 'react';
import {
    Modal,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Color } from '../../helper/Color';
import { verticalScale } from "../Metrics";
import RadioButton from '../RadioButton';
import Currency from '../Currency';
import { useForm } from "react-hook-form";


function GeneralModal({ toggle, modalVisible, dateAndTime, button2Press, handlePaymentChange, button1Press, content, content2, button1Label, button2Label, title, selectedPayment }) {

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({

    });
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
            height: handlePaymentChange ? verticalScale(550) : verticalScale(350),
            borderRadius: 5,
            backgroundColor: "#f9fafb",
        },
        modalHeader: {
            flex: handlePaymentChange ? 0.15 : 0.3,
            justifyContent: "center",

        },
        modalBody: {
            flex: handlePaymentChange ? 0.8 : 0.6,
            backgroundColor: "#fff",
            paddingVertical: 20,
            paddingHorizontal: 10,
            justifyContent: "center",
            alignItems: "center"
        },
        modalFooter: {
            flex: handlePaymentChange ? 0.11 : 0.2,
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
        },
        closeButton: {
            position: 'absolute',
            top: 17,
            right: 10,
            width: 25,
            height: 25,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

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
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity onPress={() => toggle && toggle()} style={styles.closeButton}>
                            <AntDesign name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.divider}></View>
                    <View style={styles.modalBody}>
                        {dateAndTime && (
                            <View style={{ flex: 1, width: "100%", paddingTop: 20 }}>
                                {dateAndTime}
                            </View>
                        )}
                        <View style={{ flex: 1, flexDirection: "row", alignItems: 'flex-start', height: 30 }}>
                            <View style={{ flex: 1, }}>
                                {content && (
                                    <View style={{ alignItems: 'flex-start' }}>
                                        <Text style={{ fontSize: 30 }}>
                                            {content}
                                        </Text>
                                    </View>
                                )}
                                {content2 && (
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{ color: "red", fontWeight: "bold", fontSize: 40 }}>{content2}</Text>
                                    </View>
                                )}
                                {handlePaymentChange && (
                                    <View style={{ flex: 1, alignItems: 'flex-start' }}>
                                        <RadioButton
                                            label="Cash"
                                            value="cash"
                                            checked={selectedPayment === 1}
                                            onPress={() => handlePaymentChange(1)}
                                        />
                                        <RadioButton
                                            label="UPI"
                                            value="upi"
                                            checked={selectedPayment === 2}
                                            onPress={() => handlePaymentChange(2)}
                                        />
                                        <RadioButton
                                            label="Both"
                                            value="both"
                                            checked={selectedPayment === 3}
                                            onPress={() => handlePaymentChange(3)}
                                        />
                                        {selectedPayment === 3 && (
                                            <View style={{ flex: 1, flexDirection: "row" }}>
                                                <View style={{ width: '49%', flex: 0.48 }}>
                                                    <Currency
                                                        title={'Cash'}
                                                        name={'cash'}
                                                        control={control}
                                                        placeholder="Cash"
                                                        edit
                                                        required
                                                    />
                                                </View>
                                                <View style={{ width: '49%', flex: 0.48, paddingLeft:10 }}>
                                                    <Currency
                                                        title={'Paytm'}
                                                        name={'upi'}
                                                        control={control}
                                                        placeholder="Paytm"
                                                        edit
                                                        required
                                                    />
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                )}

                            </View>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.modalFooter}>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <TouchableOpacity style={{ flex: 1, backgroundColor: Color.PRIMARY, alignItems: 'center', justifyContent: 'center' }} onPress={selectedPayment ? handleSubmit(button1Press) : () => {
                                button1Press && button1Press();
                                toggle && toggle();
                            }}>
                                <Text style={{ color: Color.PRIMARY_TEXT, fontSize: 15, fontWeight: "700" }}>{button1Label}</Text>
                            </TouchableOpacity>
                            {button2Label && (
                                <TouchableOpacity style={{ flex: 1, backgroundColor: Color.SECONDARY_BUTTON, alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                                    toggle && toggle();
                                    button2Press && button2Press();
                                }} >
                                    <Text style={{ color: Color.PRIMARY_TEXT, fontSize: 15, fontWeight: "700" }}>{button2Label}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );

}

export default GeneralModal;