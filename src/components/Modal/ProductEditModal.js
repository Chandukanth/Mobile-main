import React, { useState } from 'react';

import { Modal, View, StyleSheet, Text,TouchableOpacity } from 'react-native';

import QuantityButton from "../../components/Quantity/index";

import ImageCard from "../ImageCard";

import Currency from "../../lib/Currency";
import { Color } from '../../helper/Color';

import { verticalScale } from "../Metrics";

function ProductEditModal({ toggle, modalVisible, CancelAction, item, updateAction, content }) {

    const [selectedQuantity, setSelectedQuantity] = useState("");

    const quantityOnChange = (value) => {
        setSelectedQuantity(value)
    }

    return (
        <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                toggle && toggle();
            }}>
            <View style={styles.container}>

                <View style={content ? styles.modalHeight : styles.modalContainer}>

                    <View style={content ? styles.modalHeader :styles.Header }>
                        <Text style={styles.title}>Edit Quantity</Text>
                    </View>

                    <View style={styles.divider}></View>

                    <View style={content ? styles.modalBody : styles.modal}>

                        {item && (
                            <View style={styles.imageStyle}>
                                <View >
                                    <ImageCard ImageUrl={item.image} />
                                </View>

                                <View style={{ flex: 1}}>

                                    {item.brand && <Text style={{ fontWeight: "700" }}>{item.brand}</Text>}

                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={{
                                            fontSize: 16,
                                            textTransform: "capitalize",
                                        }}>
                                            {item.name}
                                            {item.size ? "," + item.size : ""}
                                            {item.unit}
                                        </Text>
                                    </View>

                                    <View style={{ flexDirection: "row" }}>
                                        {item.sale_price ? (
                                            item.mrp != item.sale_price && item.mrp > 0 ? (
                                                <View style={{ flexDirection: "row" }}>
                                                    <Text style={{ textDecorationLine: "line-through" }}>
                                                        {Currency.IndianFormat(item.mrp)}
                                                    </Text>
                                                    {item.mrp > 0 && item.mrp != item.sale_price ? (
                                                        <Text style={{ paddingLeft: 10 }}>
                                                            {Currency.IndianFormat(item.sale_price)}
                                                        </Text>
                                                    ) : (
                                                        ""
                                                    )}
                                                </View>
                                            ) : (
                                                <Text>{Currency.IndianFormat(item.sale_price)}</Text>
                                            )
                                        ) : (
                                            <Text>{Currency.IndianFormat(item.mrp)}</Text>
                                        )}
                                    </View>
                                </View>
                            </View>
                        )}

                        <View style={styles.quantity}>
                            <QuantityButton quantityOnChange={quantityOnChange} quantity={item?.quantity} />
                        </View>
                        {content && (
                            <View style={styles.content}>
                                {content}
                            </View>
                        )}
                    </View>

                    <View style={styles.divider} />

                    <View style={content ? styles.modalFooter : styles.Footer}>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <TouchableOpacity style={{ flex: 0.5, backgroundColor: Color.PRIMARY, alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                                toggle && toggle();
                                updateAction && updateAction(selectedQuantity);
                                setSelectedQuantity("");
                            }}>
                                <Text style={{ color: Color.PRIMARY_BUTTON, fontSize: 15, fontWeight: "700" }}>UPDATE</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flex: 0.5, backgroundColor: Color.SECONDARY_BUTTON, alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                                toggle && toggle();
                                CancelAction && CancelAction();
                                setSelectedQuantity("");
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

export default ProductEditModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#00000099",
    },
  
    modalHeight: {
        height: verticalScale(450),
        borderRadius: 5,
        backgroundColor: "#f9fafb",
        width: "80%",
    },
    modalContainer: {
        width: "80%",
        height: verticalScale(350),
        borderRadius: 5,
        backgroundColor: "#f9fafb",
    },
    content: {
        flex: 1.1,
        width: "100%",
        paddingBottom:5
    },
    modalHeader: {
        flex: 0.4,
        justifyContent: "center",
    },
    Header: {
        flex: 0.3,
        justifyContent: "center",
    },
    quantity:{
        flex: 1,
        paddingTop:18
    },
    modalBody: {
        flex: 1.5,
        backgroundColor: "#fff",
        paddingVertical: 20,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent:"space-around"
    },
    modal: {
        flex: 1,
        backgroundColor: "#fff",
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent:"space-around"
    },
    modalFooter: {
        flex: 0.2, 
    },
    Footer: {
        flex: 0.3, 
    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
        paddingLeft :5,
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
        width:"110%",
        flexDirection: "row",
    }
});