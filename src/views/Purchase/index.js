import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    View, ScrollView, StyleSheet, TouchableOpacity, Text
} from "react-native";
import Layout from "../../components/Layout";
import purchaseService from '../../services/PurchaseService';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import apiClient from "../../apiClient";
import { endpoints } from "../../helper/ApiEndPoint";
import PurchaseCard from "./components/PurchaseCard";
import ShowMore from "../../components/ShowMore";
import Refresh from "../../components/Refresh";
import { SwipeListView } from "react-native-swipe-list-view";
import NoRecordFound from "../../components/NoRecordFound";
import DeleteConfirmationModal from "../../components/Modal/DeleteConfirmationModal";
import PermissionService from "../../services/PermissionService";
import Permission from "../../helper/Permission";
import AlternativeColor from "../../components/AlternativeBackground";
import { Color } from "../../helper/Color";

const Purchase = () => {

    const [purchase, setPurchase] = useState();
    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [page, setPage] = useState(2);
    const [HasMore, setHasMore] = useState(true);
    const [purchaseDeleteModalOpen, setPurchaseDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState("");
    const [permission, setPermission] = useState("")
    const [addPermission, setAddPermission] = useState(false)
    const stateRef = useRef();


    useEffect(() => {
        let mount = true;
        mount && deletePermission()
        //cleanup function
        return () => {
            mount = false;
        };
    }, []);
    useEffect(() => {

        if (isFocused) {
            GetPurchaseList();
            deletePermission()
        }

    }, [isFocused, refreshing]);

    const deletePermission = async () => {
        const deletePermission = await PermissionService.hasPermission(Permission.PURCHASE_DELETE);
        setPermission(deletePermission);
        const addPermission = await PermissionService.hasPermission(Permission.PURCHASE_ADD)
        setAddPermission(addPermission)
    }
    const GetPurchaseList = async () => {
        !refreshing && setIsLoading(true)
        let mount = true;
        mount && await purchaseService.getPurchase(setIsLoading,
            (callback) => setPurchase(callback));
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
                `${endpoints().PurchaseAPI
                }/search?page=${page}&pageSize=25&sort=createdAt&sortDir=DESC`
                , (error, response) => {
                    let Purchases = response?.data?.data;
                    // Set response in state
                    setPurchase((prevTitles) => {
                        return [...new Set([...prevTitles, ...Purchases])];
                    });
                    setPage((prevPageNumber) => prevPageNumber + 1);
                    setHasMore(Purchases.length > 0);
                    setIsFetching(false);
                });
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };


    const navigation = useNavigation();

    const onClickNew = () => {
        navigation.navigate("PurchaseAdd")
    }

    const purchaseDelete = async () => {
        if (selectedItem) {
            purchaseService.Delete(selectedItem.id, (error, response) => {
                GetPurchaseList()
            })
        }
    };
    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    }


    const clearRowDetail = () => {
        if (stateRef) {
            const selectedItem = stateRef.selectedItem;
            const selectedRowMap = stateRef.selecredRowMap;
            if (selectedItem && selectedRowMap) {
                closeRow(selectedRowMap, selectedItem.id)
                setSelectedItem("");
                stateRef.selectedItem = "";
                stateRef.selecredRowMap = "";
            }
        }
    }
    const purchaseDeleteModalToggle = () => {
        setPurchaseDeleteModalOpen(!purchaseDeleteModalOpen);
        clearRowDetail();
    }


    const renderHiddenItem = (data, rowMap) => {
        return (
            <View style={styles.swipeStyle}>
                <TouchableOpacity
                    style={styles.actionDeleteButton}
                    onPress={() => {
                        purchaseDeleteModalToggle()
                        setSelectedItem(data?.item);
                        stateRef.selectedItem = data?.item;
                        stateRef.selecredRowMap = rowMap;
                        closeRow(rowMap, data?.item.id);
                    }}
                >
                    <Text style={styles.btnText}>Delete</Text>
                </TouchableOpacity>
            </View>

        )
    };

    const renderItem = data => {
        let item = data?.item;
        let index = data?.index;
        const containerStyle = AlternativeColor.getBackgroundColor(index)
        return (
            <PurchaseCard
                navigation={navigation}
                item={item}
                alternative={containerStyle}

            />

        );
    };

    return (
        <Layout title="Purchases" isLoading={isLoading} refreshing={refreshing} buttonLabel={'New'} showActionButton={addPermission} buttonOnPress={onClickNew} bottomToolBar={true}
        >
            <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.container}>

                        <DeleteConfirmationModal
                            modalVisible={purchaseDeleteModalOpen}
                            toggle={purchaseDeleteModalToggle}
                            item={selectedItem}
                            updateAction={purchaseDelete}
                            bottomToolBar={true}
                            id={selectedItem?.purchaseNumber}

                        />


                        {purchase && purchase.length > 0 ?
                            <SwipeListView
                                data={purchase}
                                renderItem={renderItem}
                                renderHiddenItem={renderHiddenItem}
                                rightOpenValue={-70}
                                previewOpenValue={-40}
                                previewOpenDelay={3000}
                                disableRightSwipe={true}
                                disableLeftSwipe={permission? false : true}
                                closeOnRowOpen={true}
                                keyExtractor={item => String(item.id)}
                            />

                            : <View style={{ display: 'flex', justifyContent: 'center', alignItems: "center", paddingVertical: 350 }}>
                                <NoRecordFound iconName={"receipt"} styles={{ paddingVertical: 250, alignItems: "center" }} />
                            </View>}
                    </View>

                    <ShowMore List={purchase} isFetching={isFetching} HasMore={HasMore} onPress={LoadMoreList} />

                </ScrollView>
            </Refresh>
        </Layout >
    )
}
export default Purchase;
const styles = StyleSheet.create({

    container: {
        flex: 1,
        overflow: "scroll",
        backgroundColor: "#fff",
    },
    swipeStyle: {
        flex: 1,

    },
    actionDeleteButton: {
        alignItems: 'center',
        bottom: 10,
        justifyContent: 'center',
        position: 'absolute',
        top: 16,
        width: 70,
        backgroundColor: '#D11A2A',
        right: 7
    },
    btnText: {
        color: Color.WHITE,
    },

})


