// Import React and Component
import React from "react";

import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

const ContextMenu = ({ItemList}) => {

    return (
        <View style={styles.container}>
            <View style={{ marginTop: 10, padding: 10 }}>
                {(
                    ItemList && ItemList.length > 0 &&
                    ItemList.map((item, index) => {
                        return (
                            <TouchableOpacity onPress={(e) => item.onPress(item)
                            } style={styles.containers}>
                                <View style={{ flexDirection: "row", justifyContent: "flex-start", flex: 2, alignItems: "center" }}>
                                    <Text style={{ fontSize: 16, flex: 0.9, marginTop: 5 }}>{item.name}</Text>
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
    );
};

export default ContextMenu;

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
