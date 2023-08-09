// Import React and Component
import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Button,
    TouchableOpacity,
    Text,
    ScrollView
} from "react-native";

import { useIsFocused } from "@react-navigation/native";

import MessageService from "../services/MessageService";

import User from "../helper/User";

import UserCard from "./UserCard";

import DateTime from "../lib/DateTime";

const MessageList = (props) => {
    const { onPress } = props

    const [userList, setUserList] = useState([]);

    const isFocused = useIsFocused();

    // render the inventory list function
    useEffect(() => {
        getMessageList();
    }, [isFocused]);



    const getMessageList = () => {
        // Create a new array
        let messagerList = new Array();
        MessageService.search((error, response) => {
            let responseData = response.data.data;
            // Extract unique receiver IDs
            const receiverIds = responseData.map((item) => item.id);
            // Remove duplicates using Set and convert it back to an array
            const uniqueReceiverIds = Array.from(new Set(receiverIds));
            if (uniqueReceiverIds && uniqueReceiverIds.length > 0) {
                for (let i = 0; i < uniqueReceiverIds.length; i++) {
                    // Find the corresponding receiver object in responseData
                    const receiver = responseData.find(
                        (item) => item.id == uniqueReceiverIds[i]
                    );
                    messagerList.push({
                        firstName: receiver.first_name,
                        lastName:receiver.last_name,
                        id: receiver.id,
                        media_url: receiver.media,
                        recent_last_message: receiver.recent_last_message,
                        last_message_time: receiver.recent_message_timestamp
                    });
                }
                setUserList(messagerList);
            }
        });
    };


    return (
        <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
                <View style={styles.container}>
                    <View style={{ marginTop: 10, padding: 10 }}>
                        {userList &&
                            userList.length > 0 &&
                            userList.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        onPress={(e) => onPress(item)}
                                        style={styles.containers}
                                        key={index}
                                    >
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <UserCard
                                                firstName={item.firstName}
                                                lastName={item.lastName}
                                                image={item.media_url}
                                            />
                                            <View style={{ marginLeft: 10, flex: 1 }}>
                                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                    <Text style={{ fontSize: 14, marginTop: 5 }}>
                                                        {item.recent_last_message}
                                                    </Text>
                                                    <Text style={{ fontSize: 10, marginTop: -10, textAlign: "right" }}>
                                                        {item.last_message_time}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                    </View>
                </View>
            </View>
        </ScrollView>



    );
};

export default MessageList;

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