import React from "react";
import {
    View,
    Text,
    Button
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Color } from "../../../helper/Color";

const FooterContent = ({ searchNavigationParams, products, onScanClickAction, totalQuantity, searchNavigationUrl }) => {

    const navigation = useNavigation();

    return (
        <View style={{ flex: 1 }}>
            <View style={ products && products.length == 0 ? { flex: 1 } : { flex: 0.6 }}>
                <View style={{ flex: 1, flexDirection: "row" }}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginLeft: 2 }}>
                        <View style={{ width: "100%", }}>
                            <Button title={"Scan"} color={Color.COMPLETE} onPress={() => { onScanClickAction() }} />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default FooterContent;