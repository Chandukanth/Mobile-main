import React from 'react';
import { Modal, View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import { verticalScale } from "../Metrics";
import ProductCard from "../ProductCard";
import { AntDesign } from '@expo/vector-icons';
import { Color } from '../../helper/Color';

function ProductSelectModal({ toggle, modalVisible, items, updateAction, CancelAction }) {

    const cardOnPress = (item) => {
        updateAction(item);
        toggle && toggle();
    }

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
                        <Text style={styles.title}>Select Product </Text>
                        <TouchableOpacity onPress={() => toggle && toggle()} style={styles.closeButton}>
                            <AntDesign name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.divider}></View>

                    <View style={styles.modalBody}>
                        <FlatList
                            data={items}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item, index }) => {
                                return (
                                    <ProductCard
                                        item={item}
                                        name={item.product_name ? item.product_name : item.name}
                                        brand={item.brand_name ? item.brand_name : item.brand}
                                        mrp={item.mrp}
                                        sale_price={item.sale_price}
                                        image={item.featured_media_url ? item.featured_media_url : item.image}
                                        onPress={cardOnPress}
                                    />
                                )
                            }}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default ProductSelectModal;

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
        height: verticalScale(550),
        borderRadius: 5,
        backgroundColor: "#f9fafb",
    },
    modalHeader: {
        flex: 0.2,
        justifyContent: "center",
    },
    modalBody: {
        flex: 0.8,
        backgroundColor: "#fff",
        paddingVertical: 20,
        paddingHorizontal: 10,
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
