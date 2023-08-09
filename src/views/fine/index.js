import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Layout from "../../components/Layout";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import apiClient from "../../apiClient";
import { endpoints } from "../../helper/ApiEndPoint";
import fineService from "../../services/FineService";
import { Color } from "../../helper/Color";
import FineCard from "./components/FineCard";
import Permission from "../../helper/Permission";
import PermissionService from "../../services/PermissionService";
import AlternativeColor from "../../components/AlternativeBackground";
import ShowMore from "../../components/ShowMore";
import Refresh from "../../components/Refresh";
import NoRecordFound from "../../components/NoRecordFound";
import DeleteConfirmationModal from "../../components/Modal/DeleteConfirmationModal";
import { SwipeListView } from "react-native-swipe-list-view";


const Fine = () => {
    const [fine, setFine] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const isFocused = useIsFocused();
    const [page, setPage] = useState(2);
    const [permission, setPermission] = useState("")
    const [deletePermission, setDeletePermission] = useState("")
    const [selectedItem, setSelectedItem] = useState("");
    const [fineDeleteModalOpen,setFineDeleteModalOpen] = useState("")



    const [HasMore, setHasMore] = useState(true);

    const navigation = useNavigation();
    const stateRef = useRef();


    const addPermission = async () => {
        const addPermission = await PermissionService.hasPermission(Permission.FINE_ADD);
        setPermission(addPermission);
         const deletePermission = await PermissionService.hasPermission(Permission.FINE_DELETE);
        setDeletePermission(deletePermission);
    }
    useEffect(() => {
        let mount = true;
        mount && addPermission()
        //cleanup function
        return () => {
            mount = false;
        };
    }, [refreshing]);

    useEffect(() => {
        if (isFocused) {
            getFineList();
        }

    }, [isFocused,refreshing, navigation]);

    const AddNew = () => {
        navigation.navigate("FineForm");
    };

    const fineDelete = async () => {
        if (selectedItem) {
            fineService.delete(selectedItem.id, (error, response) => {
                getFineList()
            })
        }
    };
    const getFineList = async () => {
        setPage(2);
        setHasMore("0");
        setIsLoading(true)
        let params = { sort: "date", sortDir: "DESC" }
        await fineService.search(params,
            (err, response) => {
                let fines = response && response?.data && response?.data?.data;
                setFine(fines)
                setIsLoading(false);

            });
    }

    const LoadMoreList = async () => {
        try {
            setIsFetching(true);
    
            let params = { page: page }
    
            fineService.search(params, (err,response) => {
    
                let fines = response && response?.data && response?.data?.data;
    
                // Set response in state
                setFine((prevTitles) => {
                    return [...new Set([...prevTitles, ...fines])];
                });
                setPage((prevPageNumber) => prevPageNumber + 1);
                setHasMore(fines.length > 0);
                setIsFetching(false);
            });
        } catch (err) {
            console.log(err);
            setIsLoading(false);
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
    const fineDeleteModalToggle = () => {
        setFineDeleteModalOpen(!fineDeleteModalOpen);
        clearRowDetail();
    }


    const renderHiddenItem = (data, rowMap) => {
        return (
            <View style={styles.swipeStyle}>
                <TouchableOpacity
                    style={styles.actionDeleteButton}
                    onPress={() => {
                        fineDeleteModalToggle()
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
            <FineCard
            id={item.id}
            date={item.date}
            type={item.type}
            user={item.user}
            amount={item.amount}
            status={item.status}
            statusColor={item.statusColor}
            alternative={containerStyle}
            onPress={() => {
                navigation.navigate("FineForm", { item });
            }}
        />
        );
    };


    return (
        <Layout
            title='Fines'
            buttonLabel={permission ? "Add" : ""}
            buttonOnPress={AddNew}
            isLoading={isLoading}
            refreshing={refreshing} 
            bottomToolBar={true}
        >
            <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>
                <View>
                <DeleteConfirmationModal
                            modalVisible={fineDeleteModalOpen}
                            toggle={fineDeleteModalToggle}
                            item={selectedItem}
                            updateAction={fineDelete}
                            bottomToolBar={true}
                            id={selectedItem?.id}

                        />
                    {fine && fine.length > 0 ? 

                            <SwipeListView
                                data={fine}
                                renderItem={renderItem}
                                renderHiddenItem={renderHiddenItem}
                                rightOpenValue={-70}
                                previewOpenValue={-40}
                                previewOpenDelay={3000}
                                disableRightSwipe={true}
                                disableLeftSwipe={deletePermission? false : true}
                                closeOnRowOpen={true}
                                keyExtractor={item => String(item.id)}
                            />
                    :                              
                       <NoRecordFound iconName={"receipt"} styles={{ paddingVertical: 250, alignItems: "center" }} />

                    }
                    <ShowMore List={fine} isFetching={isFetching} HasMore={HasMore} onPress={LoadMoreList} />
                </View>
            </Refresh>
        </Layout>
    )
}


export default Fine;
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


