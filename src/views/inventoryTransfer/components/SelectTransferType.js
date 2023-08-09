import React, { useEffect, useState } from 'react'
import { Text, View, Button, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Layout from '../../../components/Layout';
import TransferTypeService from "../../../services/TransferTypeService"
import { MaterialIcons } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import TransferType from "../../../helper/TransferType"
import inventoryTransferService from "../../../services/InventoryTransferService";
import AsyncStorage from "../../../lib/AsyncStorage";
import AsyncStorageConstants from "../../../helper/AsyncStorage";
import DateTime from "../../../lib/DateTime";


const SelectTransferType = () => {
    const [transferTypeList, setTransferTypeList] = useState();
    const [ids, setSelectedLocationId] = useState("");
    const [locationName, setSelectedLocationName] = useState("")

    const isFocused = useIsFocused();
    const navigation = useNavigation();

    useEffect(() => {
        TransferTypeList();
    }, [isFocused])

    useEffect(() => {
        saveStore();
    }, [isFocused])

    const saveStore = async () => {

        try {
            await AsyncStorage.getItem(AsyncStorageConstants.SELECTED_LOCATION_ID).then((res) => setSelectedLocationId(res))
            await AsyncStorage.getItem(AsyncStorageConstants.SELECTED_LOCATION_NAME).then((res) => setSelectedLocationName(res))

        }
        catch (error) {
            console.log(error);

        }

    }
    const TransferTypeList = async () => {

        TransferTypeService.searchByRole(null, (error, response) => {
            if (response && response.data && response.data.data) {
                setTransferTypeList(response.data.data)
            }
        })

    }

    const onSelectStore = (selectedStore, params) => {
        try {
            inventoryTransferService.onStoreSelect(selectedStore, params);
        } catch (err) {
            console.log(err);
        }
    }


    const typeOnPress = (item) => {

        if (item && item.allow_to_change_from_store == TransferType.ALLOW_TO_CHANGE_STORE) {
            navigation.navigate("StoreSelector", {
                onSelectStore: onSelectStore,
                params: { type: item.id, toLocationId: item.default_to_store ? item.default_to_store : null, toLocationName: item.default_to_store_name ? item.default_to_store_name : null, offlineMode: item?.offline_mode, navigation }
            });


        } else if (item && item.allow_to_change_to_store == TransferType.ALLOW_TO_CHANGE_STORE) {
          
            navigation.navigate("StoreSelector", {
                onSelectStore: onSelectStore,
                params: { type: item.id, fromLocationId: ids ? ids : null, offlineMode: item?.offline_mode, fromLocationName: locationName ? locationName : null, navigation }
            });

        } else if (item && item.default_to_store) {

            const FromStore = ids ? ids : null;

            const ToStore = item.default_to_store

            let bodyData = {
                fromLocationId: FromStore,
                toLocationId: ToStore,
                type: { value: item.id }
            };

            inventoryTransferService.addInventory(bodyData, async (error, transferDetails, currentStatusId) => {

                if (transferDetails) {
                    if (item?.offlineMode) {
                        await inventoryTransferService.syncInventory(transferDetails);
                    }

                    navigation.navigate("Transfer/ProductList", {
                        fromLocationId: transferDetails.from_store_id,
                        toLocationId: transferDetails.to_store_id,
                        transferId: transferDetails.id,
                        fromLocationName: locationName ? locationName : "",
                        toLocationName: item.default_to_store_name ? item.default_to_store_name : "",
                        type: item?.id,
                        date: DateTime.getCurrentDate("DD-MMM-YYYY hh:mm A"),
                        offlineMode: item?.offlineMode,
                        currentStatusId: currentStatusId
                    });
                }
            });
        }
    };

    return (
        <Layout title={"Transfer Type Selection"}>
            <ScrollView>
                <View style={styles.container}>
                    <View style={{ padding: 10 }}>
                        {(
                            transferTypeList && transferTypeList.length > 0 &&
                            transferTypeList.map((item) => {
                                return (
                                    <TouchableOpacity onPress={() => {
                                        typeOnPress(item);
                                    }
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

            </ScrollView>

        </Layout>
    )
}

export default SelectTransferType

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