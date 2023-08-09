// Import React and Component
import React, { useEffect } from "react";
import {
    StyleSheet,
    ScrollView
} from "react-native";

import ContextMenu from "../../components/ContextMenu";

import { useNavigation } from "@react-navigation/native";

import Layout from "../../components/Layout";

import requestHardwarePermission from "../../lib/Permission";

const Setting = () => {

    const navigation = useNavigation();

    useEffect(()=> {
        requestHardwarePermission();
    },[]);

    const bluetoothClickHandler = () => {
        navigation.navigate("Bluetooth/Setting");
    }

    const storeClickHandler = () => {
        navigation.navigate("Settings/SelectStore");
    }

    const SettingMenu = [{ name: "Bluetooth" , onPress: bluetoothClickHandler}, { name: "Store" , onPress: storeClickHandler}]

    return (
        <Layout title={"Settings"} bottomToolBar={true}
        >
            <ScrollView>
                <ContextMenu ItemList={SettingMenu} />
            </ScrollView>
        </Layout>
    );
};

export default Setting;

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
