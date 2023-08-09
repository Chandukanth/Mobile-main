import React from 'react';

import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Color } from '../helper/Color';

import { verticalScale } from './Metrics';

import { AntDesign } from '@expo/vector-icons';

import { useForm } from 'react-hook-form';

import TextInput from './TextInput';

import BrandSelect from './BrandSelect';

import VerticalSpace10 from './VerticleSpace10';

import FileUpload from '../views/Visitor/Media';


function ProductAdd({ toggle, modalVisible, image, content, setImage, setFile, barcode, button2Press, OnSelect, button1Press, button1Label, button2Label, title, onInputChange, quantityOnChange, onMrpChange, handleBarcodeChange }) {
    const defaultValues = {
        barcode: barcode || ""
    }
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: defaultValues
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
                        <ScrollView style={{ paddingBottom: 5, width: '100%' }}>
                            <FileUpload image={image ? image : ""} setImage={setImage} setFile={setFile} />
                            <View style={{ width: "100%" }}>
                                <BrandSelect
                                    onChange={OnSelect}
                                    label="Brand"
                                />
                            </View>
                            <VerticalSpace10 />
                            <TextInput
                                title={"Product Name"}
                                name="name"
                                placeholder="Enter Product Name"
                                control={control}
                                required={true}
                                onInputChange={onInputChange}
                            />
                            <VerticalSpace10 />

                            <TextInput
                                title={"MRP"}
                                name="mrp"
                                placeholder="Enter MRP"
                                control={control}
                                keyboardType='numeric'
                                required
                                onInputChange={onMrpChange}
                            />
                            <VerticalSpace10 />
                            <TextInput
                                title={"Barcode"}
                                name="barcode"
                                placeholder="Enter Barcode"
                                keyboardType="numeric"
                                control={control}
                                onInputChange={handleBarcodeChange}
                            />
                            <TextInput
                                title={"Quantity"}
                                name="quantity"
                                placeholder="Enter Quantity"
                                keyboardType="numeric"
                                control={control}
                                onInputChange={quantityOnChange}
                            />


                            {content && (
                                <View style={styles.content}>
                                    {content}
                                </View>
                            )}
                        </ScrollView>

                    </View>

                    <View style={styles.divider} />

                    <View style={styles.modalFooter}>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <TouchableOpacity style={{ flex: 1, backgroundColor: Color.PRIMARY, alignItems: 'center', justifyContent: 'center' }} onPress={handleSubmit((values) => { button1Press(values) })

                            }>
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
        </Modal >

    );
}

export default ProductAdd;

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#00000099",
    },
    modalContainer: {
        width: "100%",
        height: verticalScale(650),
        borderRadius: 5,
        backgroundColor: "#f9fafb",
    },
    modalHeader: {
        flex: 0.1,
        justifyContent: "center",

    },
    modalBody: {
        flex: 0.8,
        backgroundColor: "#fff",
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    modalFooter: {
        flex: 0.1,

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
        backgroundColor: "#db2828",
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
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
    content: {
        flex: 0.2,
        width: "100%",
    },
});