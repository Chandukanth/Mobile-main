// Import React and Component
import React, { useState } from "react";
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { MaterialIcons } from "@expo/vector-icons";

import DatePicker from "../../../components/DatePicker";

import inventoryTransferService from "../../../services/InventoryTransferService";
import { Color } from "../../../helper/Color";

const GeneralTab = (props) => {

    const [selectedDate, setSelectedDate] = useState(null);

    const { fromLocationName, toLocationName, transferId, date, type, typeName, toLocationId, fromLocationId, notes, offlineMode, manageOthers, currentStatusId, onStoreUpdate } = props

    const navigation = useNavigation();

    const params = {
        transferId: transferId,
        toLocationId: toLocationId,
        fromLocationId: fromLocationId,
        date: date,
        type: type,
        fromLocationName: fromLocationName,
        toLocationName: toLocationName,
        notes: notes,
        offlineMode: offlineMode,
        currentStatusId: currentStatusId
    }

    const onStoreClick = (destinationStore) => {
        params.destinationStore = destinationStore;
        navigation.navigate("StoreSelector", { onSelectStore: onStoreUpdate, params })
    }

    const onDateSelect = (date) => {
        let selectedDate = new Date(date);
        setSelectedDate(selectedDate)
        if (params.transferId) {
            inventoryTransferService.updateInventory(params.transferId, { date: selectedDate }, (error, response) => {
                params.date = selectedDate
                navigation.navigate("Transfer/ProductList", 
                   params
                );

            })
        }
    }

    return (
        <View style={styles.container}>
            <View style={{ marginTop: 10, padding: 10 }}>

                <View
                    style={styles.dateContainer}>
                    <DatePicker title="Date"
                        onDateSelect={onDateSelect}
                        disabled={manageOthers ? true : false}
                        selectedDate={selectedDate ? selectedDate : date ? new Date(date) : null} format={"DD-MMM-YYYY"} />
                </View>

                <TouchableOpacity onPress={(e) => { manageOthers && onStoreClick("fromStoreSelect") }
                } style={styles.containers}>
                    <View style={{ flexDirection: "row", justifyContent: "flex-start", flex: 2, alignItems: "center" }}>
                        <Text style={{ fontSize: 16, flex: 0.9, marginTop: 5 }}>{fromLocationName}</Text>
                        <View style={{ flex: 0.1, alignItems: "flex-end" }}>

                            <MaterialIcons name="chevron-right" size={30} color="gray" />
                        </View>
                    </View>
                </TouchableOpacity>


                <TouchableOpacity onPress={(e) => {
                    onStoreClick("toStoreSelect")
                }} style={styles.containers}>
                    <View style={{ flexDirection: "row", justifyContent: "flex-start", flex: 2, alignItems: "center" }}>
                        <Text style={{ fontSize: 16, flex: 0.9, marginTop: 5 }}>{toLocationName}</Text>
                        <View style={{ flex: 0.1, alignItems: "flex-end" }}>

                            <MaterialIcons name="chevron-right" size={30} color="gray" />
                        </View>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.containers}>
                    <View style={{ flexDirection: "row", justifyContent: "flex-start", flex: 2, alignItems: "center" }}>
                        <Text style={{ fontSize: 16, flex: 0.9, marginTop: 5 }}>{typeName}</Text>
                        <View style={{ flex: 0.1, alignItems: "flex-end" }}>

                            <MaterialIcons name="chevron-right" size={30} color="gray" />
                        </View>
                    </View>

                </TouchableOpacity>

                <TouchableOpacity style={styles.containers} onPress={(e) => {
                    navigation.navigate("inventoryTransfer/NotesArea", params)
                }}>
                    <View style={{ flexDirection: "row", justifyContent: "flex-start", flex: 2, alignItems: "center" }}>
                        {notes ? (
                            <Text style={{ fontSize: 16, flex: 0.9, marginTop: 5 }}>{notes}</Text>
                        ) : (
                            <Text style={{ fontSize: 16, flex: 0.9, marginTop: 5, color: Color.ACTIVE }}>Add Your Notes Here</Text>
                        )}
                        <View style={{ flex: 0.1, alignItems: "flex-end" }}>

                            <MaterialIcons name="chevron-right" size={30} color="gray" />
                        </View>
                    </View>

                </TouchableOpacity>
            </View>
        </View>
    );
};

export default GeneralTab;

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
    dateContainer: {
        height: 80,
        backgroundColor: "#fff",
        borderColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "lightgrey",
    }
});
