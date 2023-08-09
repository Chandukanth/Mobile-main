import React, { useState } from 'react';

import { Modal, View, StyleSheet, Dimensions, Button, Text } from "react-native";

import { Color } from "../helper/Color";

import { MaterialIcons } from "@expo/vector-icons";

const FilterDrawer = ({ isOpen, children, closeDrawer, applyFilter }) => {

    if (!isOpen) return null;

    // We need to get the height of the phone and use it relatively, 
    // This is because height of phones vary
    const windowHeight = Dimensions.get('window').height;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            // We use the state here to toggle visibility of Bottom Sheet 
            visible={isOpen}
            // We pass our function as default function to close the Modal
            style={{ height: 40, width: 40 }}
        >
            <View style={[styles.bottomSheet, styles.container, { height: windowHeight * 0.9 }]}>

                <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
                    <MaterialIcons name="close" size={30} color="gray" onPress={()=> closeDrawer()} />
                </View>

                {children}

                <View style={{ flex: 1, flexDirection: "row", marginTop: 20 }}>
                    <View style={{ flex: 1 }}>
                        <Button title={"Apply Filter"} color={Color.PRIMARY} onPress={() => applyFilter()} />
                    </View>
                </View>

            </View>
        </Modal>
    );
};

// The StyleSheet is imported from React Native
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomSheet: {
        top: "50%",
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingVertical: 23,
        paddingHorizontal: 25,
        bottom: 0,
        borderWidth: 1,
    },
});

export default FilterDrawer;