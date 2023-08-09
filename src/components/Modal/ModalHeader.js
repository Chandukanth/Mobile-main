import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { Color } from "../../helper/Color";

const ModalHeader = ({title, toggle}) => {
    return(
        <View style={styles.modalHeader}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={() => toggle && toggle()} style={styles.closeButton}>
            <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
    </View>
    )
}
export default ModalHeader
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
    closeButton: {
        position: 'absolute',
        top: 17,
        right: 10,
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },

})