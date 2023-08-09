// Import React and Component
import React  from "react";
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    ScrollView
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

const ShiftList = (props) => {
    const { onPress, disabled, shiftList } = props

    return (
        <ScrollView
            keyboardShouldPersistTaps="handled"
        >
            
            <View style={styles.container}>

                <View style={styles.container}>
                    <View style={{ marginTop: 10, padding: 10 }}>
                        {(
                            shiftList && shiftList.length > 0 &&
                            shiftList.map((item, index) => {
                                return (
                                    <TouchableOpacity onPress={(e) => onPress(item)
                                    } disabled={disabled} style={styles.containers}>
                                        <View style={{ flexDirection: "row", justifyContent: "flex-start", flex: 2, alignItems: "center" }}>
                                            <Text style={{ fontSize: 16, flex: 0.9, marginTop: 5 }}>{item.label}</Text>
                                            <View style={{ flex: 0.1, alignItems: "flex-end" }}>

                                                <MaterialIcons name="chevron-right" size={30} color="gray" />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        )}
                    </View>

                </View>

            </View>
        </ScrollView>
    );
};

export default ShiftList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: "scroll",
        backgroundColor: "#fff",
    },
    containers: {
        height: 60,
        backgroundColor: "#fff",
        borderColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "lightgrey",
    },
});