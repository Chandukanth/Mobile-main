import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Color } from "../../helper/Color";
import { verticalScale } from "../Metrics";

const ModalFooter = ({toggle, button1Label, button1Press, button2Label, button2Press }) => {
    return (
        <View style={styles.modalFooter}>
        <View style={{ flex: 1, flexDirection: "row" }}>
            <TouchableOpacity style={{ flex: 1, backgroundColor: Color.PRIMARY, alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                toggle && toggle();
                button1Press && button1Press();
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
    )
}
export default ModalFooter
const styles = StyleSheet.create({
    modalFooter: {
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        height: verticalScale(40),
        backgroundColor: "#fff"    },

})