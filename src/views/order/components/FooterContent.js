import React, { useState, useEffect, useRef } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Button
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { Color } from "../../../helper/Color";

const FooterContent = ({ orderProducts, addNew, totalAmount, onPress }) => {

    const navigation = useNavigation();

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={{ flex: 0.5, justifyContent: "center", alignItems: "center" }}>
                    <View style={{ width: "100%", }}>
                        <Button title={"Complete"} color={Color.BLACK} onPress={() => { onPress() }}
                        />
                    </View>
                </View>

                <View style={{ flex: 0.5, justifyContent: "center", alignItems: "center", marginLeft: 2 }}>
                    <View style={{ width: "100%", }}>
                        <Button title={"Scan"} color="#228b22" onPress={() => { addNew() }} />
                    </View>
                </View>
            </View>
        </View>
    )
}

export default FooterContent;