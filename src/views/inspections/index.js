// Import React and Component
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import SearchBar from "../../components/SearchBar";
import Layout from "../../components/Layout";
import { useIsFocused } from "@react-navigation/native";
import Refresh from "../../components/Refresh";
import InspectionService from "../../services/InspectionService";
import AlternativeColor from "../../components/AlternativeBackground";
import DateText from "../../components/DateText";
import Label from "../../components/Label";
import NoRecordFound from "../../components/NoRecordFound";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import UserCard from "../../components/UserCard";
import AsyncStorage from "../../lib/AsyncStorage";
import AsyncStorageConstants from "../../helper/AsyncStorage";
import ShowMore from "../../components/ShowMore";

const Inspections = (props) => {
    const [inspectionList, setInspectionList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchPhrase, setSearchPhrase] = useState("");
    const [clicked, setClicked] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [page, setPage] = useState(2);
    const [HasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const isFocused = useIsFocused();

    const navigation = useNavigation();

    useEffect(() => {
        let mount = true;
        mount && getInspectionList({ page: 1 }, true)
        //cleanup function
        return () => {
            mount = false;
        };
    }, [isFocused, refreshing]);

    const getInspectionList = (params, loading) => {
        try {

            if (loading) {
                setIsLoading(true);
            }

            InspectionService.search(params, (error, response) => {

                if (response && response.data && response.data.data) {
                    setInspectionList(response.data.data);
                }
                setIsLoading(false);

            })
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    }

    const handleChange = async (search) => {
        setSearchTerm(search);
        getInspectionList({ search: search })
    };

    const onTypeSelect = async (selectedType) => {

        let locationId = await AsyncStorage.getItem(AsyncStorageConstants.SELECTED_LOCATION_ID);


        let locationName = await AsyncStorage.getItem(AsyncStorageConstants.SELECTED_LOCATION_NAME);

        let bodyData = {
            storeId: locationId,
            tagId: selectedType && selectedType.id,
        }

        InspectionService.create(bodyData, (err, response) => {

            if (response && response.data && response.data.inspection)
                navigation.navigate("InspectionForm", {
                    inspectionId: response.data.inspection.id,
                    locationName: locationName,
                    tagId: selectedType && selectedType.id,
                })
        })
    }

    //render more list after click the load more button
    const LoadMoreList = async () => {
        try {
            setIsFetching(true);

            InspectionService.search({ page: page, search: searchTerm ? searchTerm : "" }, (error, response) => {
                if (response && response.data && response.data.data) {
                    let inspections = response.data.data;
                    // Set response in state
                    setInspectionList((prevTitles) => {
                        return [...new Set([...prevTitles, ...inspections])];
                    });
                    setPage((prevPageNumber) => prevPageNumber + 1);
                    setHasMore(products.length > 0);
                    setIsFetching(false);
                } else {
                    setIsFetching(false);
                }

            })

        } catch (err) {
            console.log(err);
        }
    };

    const AddNew = () => {
        navigation.navigate("TypeSelect", {
            typeName: "Custom Field",
            onTypeSelect: onTypeSelect
        })
    }

    return (
        <Layout
            title={"Inspection"}
            isLoading={isLoading}
            refreshing={refreshing}
            buttonLabel={"Add"}
            buttonOnPress={AddNew}
            bottomToolBar={true}
        >
            <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>

                <SearchBar
                    searchPhrase={searchPhrase}
                    setSearchPhrase={setSearchPhrase}
                    setClicked={setClicked}
                    clicked={clicked}
                    onPress={getInspectionList}
                    handleChange={handleChange}
                    noScanner
                />

                {inspectionList && inspectionList.length > 0 ? (
                    inspectionList.map((item, index) => {
                        const containerStyle = AlternativeColor.getBackgroundColor(index)

                        return (
                            <TouchableOpacity style={[styles.align, containerStyle]}
                                onPress={() => navigation.navigate("InspectionForm", {
                                    inspectionId: item.id,
                                    locationName: item.locationName,
                                    tagId: item.tag_id
                                })}
                            >
                                <View>

                                    <DateText date={item?.createdAt} />

                                    <Label text={item?.typeName} bold={true} size={14} />

                                    <Label text={item?.locationName} size={14} />

                                    <UserCard firstName={item?.ownerName} />

                                </View>

                            </TouchableOpacity>
                        );
                    })


                ) : (
                    <NoRecordFound iconName="receipt" styles={{ paddingVertical: 250, alignItems: "center" }} />
                )}

                <ShowMore List={inspectionList} isFetching={isFetching} HasMore={HasMore} onPress={LoadMoreList} />

            </Refresh>
        </Layout>
    );
};

export default Inspections;

const styles = StyleSheet.create({
    align: {
        alignItems: "flex-start",
        paddingBottom: 10,
        paddingTop: 10,
    },
})
