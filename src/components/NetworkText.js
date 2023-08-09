import React from "react";
import { Text, StyleSheet } from "react-native";
import { Color } from "../helper/Color";

const NetworkText = () => {
    return (
        <Text style={styles.text}>No Internet</Text>
    );
};

const styles = StyleSheet.create({
    text: {
        textAlign: "center",
        fontWeight: "bold",
        color: Color.WHITE,
        backgroundColor:Color.RED
    },
});

export default NetworkText;
