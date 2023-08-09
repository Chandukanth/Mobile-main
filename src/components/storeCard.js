// Import React and Component
import React from "react";
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Button,
} from "react-native";

import { useNavigation } from "@react-navigation/native"

import { MaterialIcons } from "@expo/vector-icons";
import { Color } from "../helper/Color";


const StoreCard = (props) => {
    const { data, date, navigationurl, params,param, permission, shiftNavigationUrl, shiftNavigationParams, Shift, User, userNavigationUrl, userNavigationParams, manageOther, newOrder } = props

    const navigation = useNavigation();

    return (

        <View style={styles.container}>
            <View style={{ marginTop: 10, padding: 10 }}>
                {!newOrder && (
                    <View
                        style={styles.containers}>
                        <Text style={{ fontSize: 12, flex: 0.9, marginTop: 5, fontWeight: 'bold' }}>Date </Text>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", flex: 2, alignItems: "center" }}>
                            <Text style={{ fontSize: 16, flex: 0.9, marginTop: 5 }}>{date}</Text>
                        </View>
                    </View>
                )}



                {Shift && (
                    <TouchableOpacity
                        onPress={(e) => permission && navigation.navigate(shiftNavigationUrl, shiftNavigationParams)}
                        style={styles.containers}>
                        <Text style={{ fontSize: 12, flex: 0.9, marginTop: 5, fontWeight: 'bold' }}>Shift </Text>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", flex: 2, alignItems: "center" }}>
                            <Text style={{ fontSize: 16, flex: 0.9, marginTop: 5 }}>{Shift}</Text>
                            <View style={{ flex: 0.1, alignItems: "flex-end" }}>
                                {permission && (
                                    <MaterialIcons name="chevron-right" size={30} color={Color.RIGHT_ARROW} />

                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                )}

                <TouchableOpacity onPress={(e) => permission && navigation.navigate(navigationurl, params)
                } style={styles.containers}>
                    <Text style={{ fontSize: 12, flex: 0.9, marginTop: 5, fontWeight: 'bold' }}>Store </Text>
                    <View style={{ flexDirection: "row", justifyContent: "flex-start", flex: 2, alignItems: "center" }}>
                        <Text style={{ fontSize: 16, flex: 0.9, marginTop: 5 }}>{data}</Text>
                        <View style={{ flex: 0.1, alignItems: "flex-end" }}>

                            {permission && (
                                <MaterialIcons name="chevron-right" size={30} color={Color.RIGHT_ARROW} />

                            )}
                        </View>
                    </View>
                </TouchableOpacity>

                {User && (
                    <TouchableOpacity onPress={(e) => manageOther && permission && navigation.navigate(userNavigationUrl, userNavigationParams)}
                        style={styles.containers}>
                        <Text style={{ fontSize: 12, flex: 0.9, marginTop: 5, fontWeight: 'bold' }}>Store Executive  </Text>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", flex: 2, alignItems: "center" }}>
                            <Text style={{ fontSize: 16, flex: 0.9, marginTop: 5 }}>{User}</Text>
                            <View style={{ flex: 0.1, alignItems: "flex-end" }}>

                            {permission && (
                                <MaterialIcons name="chevron-right" size={30} color={Color.RIGHT_ARROW} />

                            )}                          
                              </View>
                        </View>
                    </TouchableOpacity>
                )}

            </View>

        </View>
    );
};

export default StoreCard;

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
