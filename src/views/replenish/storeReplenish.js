// Import React and Component
import React, { useState, useEffect } from "react";

import { StyleSheet, View, ScrollView, Button } from "react-native";

import { useIsFocused, useNavigation } from "@react-navigation/native";

// Spinner
import Spinner from "../../components/Spinner";

import Select from "../../components/Select";

//ProductCard UI
import ProductCard from "../../components/ProductCard";

//Footer and Header
import Layout from "../../components/Layout";

//noRecordFound Message
import NoRecordFound from "../../components/NoRecordFound"

import { Card, Paragraph, Badge } from 'react-native-paper';

import { Color } from "../../helper/Color";

import QuantitySelectModal from "../../components/Modal/QuantitySelectModal";

import AsyncStorage from "@react-native-async-storage/async-storage";

//Helpers
import AsyncStorageConstants from "../../helper/AsyncStorage";

import InventoryTransferService from "../../services/InventoryTransferService";

import OrderProductService from "../../services/OrderProductService";

import FilterDrawer from "./components/filter";

import StoreService from "../../services/StoreService";

import { useForm } from "react-hook-form";

import ReplenishCard from "./components/ReplenishCard";

import Toast from 'react-native-simple-toast';
import ShowMore from "../../components/ShowMore";
import StoreSelect from "../../components/StoreSelect";

const OrderProductReplenish = (props) => {
    //Loading
    const [isLoading, setIsLoading] = useState(false);
    //search
    const [isFetching, setIsFetching] = useState(false);
    //setting tha initial page
    const [page, setPage] = useState(1);
    //we need to know if there is more data
    const [HasMore, setHasMore] = useState(true);

    const isFocused = useIsFocused();

    const [openQuantitySelectModal, setQunatitySelectModal] = useState(false);

    const [selectedLocationId, setSelectedLocationId] = useState("");

    const [defaultStoreId, setStoreId] = useState();

    const [selectedQuantity, setSelectedQuantity] = useState("");

    const [orderProductList, setOrderProductList] = useState([])

    const [selectedProductId, setSelectedProductId] = useState("");

    const [openFilter, setOpenFilter] = useState(false);

    const [storeList, setStoreList] = useState([])

    const [replenishStoreId, setReplenishStoreId] = useState();

    const [brandId, setBrandId] = useState("");

    const [categoryId, setCategoryId] = useState("");

    const navigation = useNavigation();

    //render first time
    useEffect(() => {
        if (isFocused) {
            let mount = true;

            mount && getStoreList();

            getStoreID();

            return () => {
                mount = false;
            };
        }
    }, [isFocused, navigation]);

    useEffect(() => {
        if (replenishStoreId) {
            getOrderProductList({ page: page, storeId: replenishStoreId });
        } else if (storeList && storeList.length > 0) {
            getOrderProductList({ page: page, storeId: storeList[0].value });
        }

    }, [replenishStoreId]);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValue: {} });


    const getStoreList = () => {
        StoreService.list((error, response) => {
            if(response && response.data && response.data.data){
                setStoreList(StoreService.processList(response.data.data))
            }
        })
    }

    const getStoreID = async () => {
        await AsyncStorage.getItem(AsyncStorageConstants.SELECTED_LOCATION_ID).then((res) => setStoreId(res))

        await AsyncStorage.getItem(AsyncStorageConstants.REPLENISH_STORE_ID).then((res) => setReplenishStoreId(res))

    }

    const getReplenishOrderProduct = (params, callback) => {
        try {
            OrderProductService.replenishSearch(params, (error, response) => {

                let orderProducts = new Array();

                if (response && response.data && response.data.data) {

                    let orderProductList = response.data.data;

                    if (orderProductList && orderProductList.length > 0) {

                        for (let i = 0; i < orderProductList.length; i++) {
                            const { id, productDetails, quantity, store_id, sale_price, mrp, product_id, status, locationName, replenishQuantity, orderDate } = orderProductList[i];

                            let productObject = {
                                brand: productDetails?.brand_name,
                                category: productDetails?.category_name,
                                image: productDetails?.featured_media_url,
                                name: productDetails?.product_name,
                                product_display_name: productDetails?.product_display_name,
                                sale_price: sale_price,
                                mrp: mrp,
                                productId: product_id,
                                size: productDetails?.size,
                                status: status,
                                barcode: productDetails?.barcode,
                                storeId: store_id,
                                id: id,
                                quantity,
                                locationName: locationName,
                                replenishQuantity,
                                orderDate: orderDate
                            }

                            orderProducts.push(productObject)
                        }

                        return callback(orderProducts);
                    } else {
                        return callback([]);
                    }
                }
            });
        } catch (err) {
            console.log(err);
        }
    }

    const getOrderProductList = (paramsObject) => {

        let params = new Object();

        if (paramsObject && paramsObject.page) {
            params.page = paramsObject.page;
        }

        if (paramsObject.storeId) {
            params.storeId = paramsObject.storeId;
        }

        if (paramsObject.category) {
            params.category = paramsObject.category;
        }

        if (paramsObject.brand) {
            params.brand = paramsObject.brand;
        }

        getReplenishOrderProduct(params, (orderProducts) => {

            setOrderProductList(orderProducts);

        })
    }



    //render more list after click the load more button
    const LoadMoreList = async () => {
        try {
            setIsFetching(true);

            let params = new Object();

            params.page = page + 1;

            params.storeId = replenishStoreId;

            getReplenishOrderProduct(params, (response) => {

                // Set response in state
                setOrderProductList((prevTitles) => {
                    return [...new Set([...prevTitles, ...response])];
                });
                setPage((prevPageNumber) => prevPageNumber + 1);
                setHasMore(response.length > 0);
                setIsFetching(false);
            })

        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };

    const quantitySelectModal = (item) => {
        if (item) {
            setSelectedProductId(item?.productId);
            setSelectedLocationId(item?.storeId);
            setSelectedQuantity(item?.quantity);
        }
        setQunatitySelectModal(true);
    }


    const quantitySelectModalToggle = () => {
        setQunatitySelectModal(false);
        setSelectedLocationId("");
        setSelectedQuantity("");
        setSelectedProductId("");
    }


    const quantityOnChange = (value, item) => {
        if (item) {
            setSelectedLocationId(item?.storeId);
            setSelectedQuantity(value);
        } else if (value) {
            setSelectedQuantity(value.value);
        }
    }

    const onStoreChange = (selectedStore) => {
        if (selectedStore) {
            setPage(1);
            selectedStore = selectedStore.toString();
            AsyncStorage.setItem(AsyncStorageConstants.REPLENISH_STORE_ID, selectedStore);
            getOrderProductList({ storeId: selectedStore, page: 1 })
        }
    }


    const onReplenishHandler = (item) => {

        let updatedQuantity = selectedQuantity ? selectedQuantity : item && item.quantity;

        let updatedStoreId = selectedLocationId ? selectedLocationId : item && item.storeId;

        let updatedProductId = selectedProductId ? selectedProductId : item && item.productId;

        if (updatedStoreId && updatedQuantity && updatedProductId) {

            let bodyData = { toLocationId: updatedStoreId, fromLocationId: defaultStoreId, quantity: updatedQuantity, productId: updatedProductId };

            InventoryTransferService.replenish(bodyData, (error, response) => {
                if (response) {
                    quantitySelectModalToggle()
                    getOrderProductList({ storeId: updatedStoreId, page: page })
                }
            })
        } else {
            Toast.show("Missing Required Fields", Toast.LONG);
        }
    }

    const closeDrawer = () => {
        setOpenFilter(!openFilter);
    }

    const categoryOnSelect = (value) => {
        setCategoryId(value);
    }

    const brandOnSelect = (value) => {
        setBrandId(value);
    }
    const applyFilter = () => {
        let params = new Object();

        params.storeId = replenishStoreId;

        params.page = page;

        if (categoryId) {
            params.category = categoryId;
        }

        if (brandId) {
            params.brand = brandId;
        }

        getOrderProductList(params);

        closeDrawer();
    }


    return (
        <Layout
            title={"Replenish"}
            isLoading={isLoading}
            bottomToolBar={true}
            showFilter={true}
            onFilterPress={closeDrawer}
        >
            <FilterDrawer isOpen={openFilter} closeDrawer={closeDrawer} categoryOnSelect={categoryOnSelect} brandOnSelect={brandOnSelect} applyFilter={applyFilter} />

            <ScrollView
            >
                <StoreSelect
                    options={storeList}
                    name={"store"}
                    control={control}
                    data={storeList && storeList.length > 0 && replenishStoreId ? storeList.find((data) => data.value == replenishStoreId) : storeList.find((data) => data.value == storeList[0].value)}
                    placeholder={"Select Location"}
                    onChange={onStoreChange}
                />

                {openQuantitySelectModal && (
                    <QuantitySelectModal Numbers={300} modalVisible={openQuantitySelectModal} toggle={quantitySelectModalToggle} value={selectedQuantity} ConfirmationAction={onReplenishHandler} onChange={quantityOnChange} />
                )}

                <View style={styles.container}>
                    <View>
                        {orderProductList && orderProductList.length > 0 ? (
                            orderProductList.map((item) => {
                                return (
                                    <ReplenishCard
                                        item={item}
                                        navigation={navigation}
                                        quantityOnChange={quantityOnChange}
                                        onReplenishHandler={onReplenishHandler}
                                        onEditHandler={quantitySelectModal}
                                    />
                                )
                            })
                        ) : (
                            <NoRecordFound styles={{ paddingVertical: 250, alignItems: "center" }} iconName="box-open" />
                        )}
                    </View>
                </View>
                <ShowMore List={orderProductList} isFetching={isFetching} HasMore={HasMore} onPress={LoadMoreList}/>
            </ScrollView>
        </Layout>
    );
};

export default OrderProductReplenish;

const styles = StyleSheet.create({
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
    tabBar: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
