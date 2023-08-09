// Import React and Component
import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    ScrollView
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";

import Layout from "../../components/Layout";

import { useIsFocused } from "@react-navigation/native";

import activityService from "../../services/ActivityService";


const ActivityForm = (props) => {
    const [activityTypeList, setActivityTypeList] = useState();
    const isFocused = useIsFocused();
    const params = props?.route?.params

    const navigation = useNavigation();

    useEffect(() => {
        getActivityTypeList();
    }, [isFocused]);

    const getActivityTypeList = () => {
        //create new rray
        let activityList = new Array();
        activityService.getActivityType((error, response) => {

            let activityTypeList = response?.data?.data;
            for (let i = 0; i < activityTypeList.length; i++) {
                activityList.push({
                    id: activityTypeList[i].id,
                    name: activityTypeList[i].name,
                    type : activityTypeList[i].type
                })

            }
            setActivityTypeList(activityList)
        })
    }

    const AddActivity = (values) => {
        const createData = {
            activity : values?.name,
            activity_type : values?.type,
            activity_type_id : values?.id,
            user_id : params?.user_id,
        };
        activityService.create(createData, (err, res) => {
            if(res){
                navigation.navigate("ActivityList")
            }
        })
    }

    /* Render flat list funciton end */
    return (

        <Layout
            title="Add Activity"
            showBackIcon={true}
        >
            <ScrollView
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container}>

                    <View style={styles.container}>
                        <View style={{ marginTop: 10, padding: 10 }}>
                            {(
                                activityTypeList && activityTypeList.length > 0 &&
                                activityTypeList.map((item, index) => {
                                    return (
                                        <TouchableOpacity onPress={(e) => AddActivity(item)
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

                </View>
            </ScrollView>

        </Layout >
    );
};

export default ActivityForm;

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
