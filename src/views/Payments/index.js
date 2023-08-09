// Import React and Component
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState, useRef } from "react";
import {
    Keyboard,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import AlternativeColor from "../../components/AlternativeBackground";
import Layout from "../../components/Layout";
import NoRecordFound from "../../components/NoRecordFound";
import Refresh from "../../components/Refresh";
import { Color } from "../../helper/Color";
import PaymentService from "../../services/PaymentService";
import PaymentCard from "./PaymentCard";
import DeleteConfirmationModal from "../../components/Modal/DeleteConfirmationModal";
import { SwipeListView } from "react-native-swipe-list-view";
import ShowMore from "../../components/ShowMore";





const Payments = (props) => {
    const [paymentList, setPaymentList] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [permission, setPermission] = useState("")
    const [refreshing, setRefreshing] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false)
    const [selectedItem, setSelectedItem] = useState("");
    const [isFetching, setIsFetching] = useState(false);


    //setting tha initial page
    const [page, setPage] = useState(2);
    //we need to know if there is more data
    const [HasMore, setHasMore] = useState(true);
    const isFocused = useIsFocused();
    const stateRef = useRef();

    useEffect(() => {
        let mount = true;
        mount && getPaymentsList()
        return () => {
            mount = false;
        };
    }, [isFocused, refreshing]);

    const getPaymentsList = async () => {
        setIsLoading(true)
        try {
            Keyboard.dismiss();
            setPage(2);
            setHasMore("0");

            let params = { page: 1 };

            PaymentService.search(params, (response) => {
                let payment = response?.data?.data;
                setIsLoading(false);

                // Set response in state
                setPaymentList(payment);
            })
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    }

    const deleteToggle = () => {
        setDeleteModal(!deleteModal)
    }

    const paymentDelete = () => {
        PaymentService.delete(selectedItem?.id, (error, response) => {
            getPaymentsList();
        })
    }

    const renderItem = data => {
        let item = data?.item;
        let index = data?.index
        const containerStyle = AlternativeColor.getBackgroundColor(index)

        return (
            <PaymentCard
                item={item}
                alternative={containerStyle}
                onPress={() => props.navigation.navigate("Payments/Form", { item: item })}
            />
        );
    };

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    }




    const renderHiddenItem = (data, rowMap) => {
        return (
            <View style={styles.swipeStyle}>
                <TouchableOpacity
                    style={[styles.actionDeleteButton]}
                    onPress={() => {
                        deleteToggle()
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


    const LoadMoreList = async () => {
        try {
            setIsFetching(true);

            let params = { page: page }

            PaymentService.search(params, (response) => {

                let payments = response?.data?.data;

                // Set response in state
                setPaymentList((prevTitles) => {
                    return [...new Set([...prevTitles, ...payments])];
                });
                setPage((prevPageNumber) => prevPageNumber + 1);
                setHasMore(payments.length > 0);
                setIsFetching(false);
            });
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };

    return (
        <Layout
            title={"Payments"}
            isLoading={isLoading}
            refreshing={refreshing}
            buttonLabel={"Add"}
            buttonOnPress={() => props.navigation.navigate("Payments/Form")}
            bottomToolBar={true}
            showBackIcon={true}
        >
            <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>
                {deleteModal && (
                    <DeleteConfirmationModal
                        modalVisible={deleteModal}
                        toggle={deleteToggle}
                        item={selectedItem}
                        id={selectedItem?.id}
                        updateAction={paymentDelete}
                    />
                )}
                {paymentList && paymentList.length > 0 ? (

                    <SwipeListView
                        data={paymentList}
                        renderItem={renderItem}
                        renderHiddenItem={renderHiddenItem}
                        rightOpenValue={-70}
                        previewOpenValue={-40}
                        previewOpenDelay={3000}
                        disableRightSwipe={true}
                        closeOnRowOpen={true}
                        keyExtractor={item => String(item.id)}
                    />
                ) : (
                    <NoRecordFound iconName="box-open" />
                )}
                <ShowMore List={paymentList} isFetching={isFetching} HasMore={HasMore} onPress={LoadMoreList} />


            </Refresh>
        </Layout>
    );
};

export default Payments;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        overflow: "scroll",
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        overflow: "scroll",
        backgroundColor: "#fff",
    },
    searchBar: {
        flex: 0.2,
        backgroundColor: "#fff",
        flexDirection: "column",
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

});
