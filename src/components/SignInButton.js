import React from 'react';
import { Color } from '../helper/Color';
import { StyleSheet, TouchableOpacity, Text } from "react-native";

const SignInButton = (props) => {
    const { title, disabled, onPress } = props
    return (
        <TouchableOpacity style={[styles.buttonStyle, { Color: Color.PRIMARY }]} onPress={onPress} disabled={disabled} activeOpacity={0.9}>
            <Text style={{ color: Color.INDIGO, padding: 6, fontSize: 16, fontWeight:'bold' }}>{title}</Text>
        </TouchableOpacity >
    )
}

export default SignInButton;


const styles = StyleSheet.create({

    buttonStyle: {
        backgroundColor: Color.ACTION_BAR_BACKGROUND,
        borderWidth: 0,
        padding: "1%",
        alignItems: "center",
        borderRadius: 5,
        marginTop: "3%",

    },

});
