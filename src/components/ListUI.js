// Import React and Component
import React from "react";
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AlternativeColor from "../components/AlternativeBackground";


const ListUI = ({ List , selectProperty, onPress}) => {

    return (
        <>
            <View style={styles.container}>
                <View>
                    {(
                        List && List.length > 0 &&
                        List.map((item, index) => {
                            const containerStyle = AlternativeColor.getBackgroundColor(index)
                            return (
                                <TouchableOpacity onPress={(e) => onPress(item)
                                } style={styles.containers}>
                                    <View style={containerStyle}>
                                        <View style={{ flexDirection: "row", justifyContent: "flex-start", flex: 2, alignItems: "center" }}>
                                            <Text style={{ fontSize: 16, flex: 0.9, marginTop: 5 }}>{item[selectProperty]}</Text>
                                            <View style={{ flex: 0.1, alignItems: "flex-end" }}>

                                                <MaterialIcons name="chevron-right" size={30} color="gray" />
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    )}
                </View>
            </View>
        </>
    )
}

export default ListUI;


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
