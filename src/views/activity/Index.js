import React, { useEffect, useState, useCallback } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    RefreshControl,
    ScrollView,
} from "react-native";
import Layout from "../../components/Layout";
import activityService from "../../services/ActivityService";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Spinner from "../../components/Spinner";
import apiClient from "../../apiClient";
import { endpoints } from "../../helper/ApiEndPoint";
import LoadMoreButton from "../../components/LoadMoreButton";
import { FontAwesome5 } from "@expo/vector-icons";
import { Color } from "../../helper/Color";
import NoRecordFound from "../../components/NoRecordFound";
import Label from "../../components/Label";
import ShowMore from "../../components/ShowMore"
import Refresh from "../../components/Refresh"

const Activity = (props) => {
    const [activity, setActivity] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const isFocused = useIsFocused();
    const [page, setPage] = useState(2);
    const [HasMore, setHasMore] = useState(true);

    const navigation = useNavigation();

    useEffect(() => {
        if (isFocused) {
            getActivityList();
        }

    }, [isFocused, navigation]);

    const getActivityList = async () => {
        setIsLoading(true)
        let mount = true;
        mount && await activityService.search(setIsLoading,
            (callback) => setActivity(callback));
        setIsLoading(false);
        setPage(2);

        //cleanup function
        return () => {
            mount = false;
        };
    }

    const LoadMoreList = async () => {
        try {
            setIsFetching(true);
            apiClient.get(
                `${endpoints().ActivityAPI
                }/search?page=${page}&pageSize=25&sort=created_at&sortDir=DESC&pagination=true`
                , (error, response) => {

                    let Activitys = response?.data?.data;
                    // Set response in state
                    setActivity((prevTitles) => {
                        return [...new Set([...prevTitles, ...Activitys])];
                    });
                    setPage((prevPageNumber) => prevPageNumber + 1);
                    setHasMore(Activitys.length > 0);
                    setIsFetching(false);
                });
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };

    return (

        <Layout
            title="Activity"
            buttonLabel={"Add"}
            isLoading={isLoading}
            buttonOnPress={() => {
                navigation.navigate("ActivityUserSelector")
            }}
            bottomToolBar={true}
        >
            <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>
                <View>
                    {activity && activity.length > 0 && activity.map((item) => {
                        return (

                            <TouchableOpacity style={styles.container}
                            >
                                <View style={styles.row} >
                                    <View>
                                        <View style={styles.row}>
                                            <Label text={item.userName} bold={true} />

                                        </View>
                                        <View style={styles.row}>
                                            <Text>{item.activity}</Text>
                                        </View>
                                        <View style={styles.row}>
                                            <Text>{(item.date)}</Text>
                                        </View>

                                    </View>

                                </View>
                                <View style={styles.status}>
                                    <View>
                                        <Text>{item.status}</Text>
                                    </View>

                                    <View>
                                        <MaterialIcons name="chevron-right" size={30} color={Color.GREY} />

                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })

                    }
                    <ShowMore List={activity} isFetching={isFetching} HasMore={HasMore} onPress={LoadMoreList} />

                </View>
            </Refresh>
        </Layout >
    );
};

export default Activity;
const styles = StyleSheet.create({

container: {
    flexDirection: "row",
    flex: 1,
    marginTop: 13,
    marginLeft: 5,
    marginRight: 5,
    alignItems: "center",
    justifyContent: "space-between",
},
row: {
    flexDirection: 'row'
},
status: {
    alignItems: "center",
    justifyContent: 'center',
    flexDirection: 'row'
},
})