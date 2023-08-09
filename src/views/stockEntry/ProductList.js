// Import React and Component
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Button,
    ScrollView
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { useIsFocused } from "@react-navigation/native";

import Layout from "../../components/Layout";

import { SwipeListView } from 'react-native-swipe-list-view';

import StockEntry from "../../helper/StockEntry";

import StockEntryService from "../../services/StockEntryService";

import AlertMessage from "../../helper/AlertMessage";

import ProductCard from "../../components/ProductCard";

import BarcodeScanner from "../../components/BarcodeScanner";

import ConfirmationModal from "../../components/Modal/ConfirmationModal";

import ProductEditModal from "../../components/Modal/ProductEditModal";

import { FontAwesome5 } from "@expo/vector-icons";

import { Color } from "../../helper/Color";

import DeleteModal from "../../components/Modal/DeleteModal";

import ProductSelectModal from "../../components/Modal/ProductSelectModal";

import dateTime from "../../lib/DateTime";

import Tab from "../../components/Tab";

import StoreCard from "../../components/storeCard";

import TabName from '../../helper/Tab';

import productService from "../../services/ProductService";

import StatusService from "../../services/StatusServices";

import ObjectName from "../../helper/ObjectName";

import AsyncStorageService from "../../services/AsyncStorageService";

import Permission from "../../helper/Permission";

import { MenuItem } from 'react-native-material-menu';

import ProductService from "../../services/ProductService";

import LoadMoreButton from "../../components/LoadMoreButton";

import Spinner from "../../components/Spinner";

import SearchBar from "../../components/SearchBar";

import ProductSearch from "../../components/ProductSearch";

import Alert from "../../lib/Alert";


import SyncService from "../../services/SyncService";

import Status from "../../helper/Status";


const ProductList = (props) => {

    const [stockEntryProductList, setStockEntryProductList] = useState([]);

    const [modalVisible, setScanModalVisible] = useState(false);

    const [scannedCode, setScannedCode] = useState("");

    const [scannedProductList, setScannedProductList] = useState("");

    const [productExistModalOpen, setProductExistModalOpen] = useState(false);

    const [quantityUpdateObject, setQuantityUpdateObject] = useState({});

    const [productNotFoundModalOpen, setProductNotFoundModalOpen] = useState(false);

    const [productEditModalOpen, setProductEditModalOpen] = useState(false);

    const [selectedItem, setSelectedItem] = useState("");

    const [productSelectModalOpen, setProductSelectModalOpen] = useState(false);

    const [refreshing, setRefreshing] = useState(false);

    const [productDeleteModalOpen, setProductDeleteModalOpen] = useState(false);

    const [activeTab, setActiveTab] = useState(TabName.PRODUCTS);

    const [status, setStatus] = useState("")

    const [totalProduct, setTotalProduct] = useState(0)

    const [isLoading, setIsLoading] = useState(false);

    const [searchPhrase, setSearchPhrase] = useState("");

    const [clicked, setClicked] = useState(false);

    const [storeProductList, setStoreProductList] = useState("");

    const isFocused = useIsFocused();

    let params = props?.route?.params;

    const navigation = useNavigation();

    const stateRef = useRef();

    useEffect(() => {
        getStockEntryProducts();
        getStatusList();
    }, [isFocused])

    const getStockEntryProducts = async () => {
        let stockEntryId = params?.stockEntryId ? params?.stockEntryId : params?.id;

        if (stockEntryId) {
            //get stock entry prodcuts
            StockEntryService.getStockEntryProducts(params?.storeId, stockEntryId,
                setIsLoading, (error, stockEntryProductList, totalQuantity, totalProduct) => {
                    stateRef.stockEntryProductList = stockEntryProductList;
                    setStockEntryProductList(stockEntryProductList);
                    setTotalProduct(totalProduct)
                });
        }
    }

    // Get Stock entry list
    const updateStockEntryStatus = async () => {

        StockEntryService.UpdateStockEntry(params.stockEntryId, { status: status }, () => {

            StockEntryService.updateStockEntryProducts(params.stockEntryId, params?.storeId);

            navigation.navigate("StockEntry");
        });
    };

    const updateQuantity = (stockEntryProductId, quantity) => {
        if (stockEntryProductList && stockEntryProductList.length > 0) {
            const newArray = stockEntryProductList.map(item => {
                if (item.stockEntryProductId === stockEntryProductId) {
                    return { ...item, quantity: quantity };
                }
                return item;
            });
            return newArray;
        }
    };

    const updateStockEntry = async (quantity, stockEntryProductId) => {
        //validate quantity exist or not
        if (quantity >= 0) {
            //create update quantity object
            let updateObject = { quantity: quantity, unit_price: selectedItem?.sale_price, product_id: selectedItem?.product_id, store_id: params?.storeId }

            //update sotck entry product quantity
            StockEntryService.updateStockEntryProduct(updateObject, stockEntryProductId, async (error, response) => {

                if (stockEntryProductList && stockEntryProductList.length > 0) {

                    let data = updateQuantity(stockEntryProductId, quantity);

                    stateRef.stockEntryProductList = data;

                    setStockEntryProductList(data);
                }

                //set product exist modal close
                setProductExistModalOpen(false);
                setSearchPhrase("")
                setClicked("")

            });
        }

    };

    const getStatusList = async () => {
        let completedStatusId = await StatusService.getStatusIdByName(ObjectName.STOCK_ENTRY, Status.GROUP_COMPLETED);
        setStatus(completedStatusId)
    };

    const addNew = () => {
        setScanModalVisible(true);
    }

    const handleSearchOnChange = async (e) => {
        const products = await productService.SearchFromLocalDB(e);
        setStoreProductList(products);
    };


    const renderItem = data => {
        let item = data?.item;
        return (

            <View style={styles.container}>
                <View>
                    {!searchPhrase && item && (
                        <ProductCard
                            size={item.size}
                            unit={item.unit}
                            name={item.name}
                            image={item.image}
                            brand={item.brand_name}
                            sale_price={item.sale_price}
                            mrp={item.mrp}
                            id={item.id}
                            item={item}
                            quantity={item.quantity}
                            QuantityField
                            editable
                        />
                    )}
                </View>
            </View>
        );
    };

    const deleteStockProduct = async (item) => {
        //validate transfer prodcut eixst or not
        if (item && item.stockEntryProductId) {
            //delete the inventory products
            StockEntryService.deleteStockEntryProduct(item.stockEntryProductId, async (error, res) => {
                //refreesh the inventory product list

                if (res && res.data) {

                    if (stockEntryProductList && stockEntryProductList.length > 0) {

                        let updatedList = stockEntryProductList.filter((data) => data.stockEntryProductId != item.stockEntryProductId);

                        stateRef.stockEntryProductList = updatedList;

                        setStockEntryProductList(updatedList);

                        setTotalProduct(updatedList.length);

                    } else {
                        setStockEntryProductList([]);
                    }

                    //clear the selected row
                    clearRowDetail();
                }
            });
        }
    }

    const renderHiddenItem = (data, rowMap) => {
        return (
            <View style={styles.swipeStyle}>
                <TouchableOpacity
                    style={[styles.productDelete]}
                    onPress={() => {
                        setSelectedItem(data?.item);
                        stateRef.selectedItem = data?.item;
                        stateRef.selecredRowMap = rowMap;
                        setProductDeleteModalOpen(true);
                    }}
                >
                    <Text style={styles.btnText}>Delete</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.productEdit]}
                    onPress={() => {
                        productEditModalToggle()
                        setSelectedItem(data?.item);
                        stateRef.selectedItem = data?.item;
                        stateRef.selecredRowMap = rowMap;
                    }}
                >
                    <Text style={styles.btnText}>Edit</Text>
                </TouchableOpacity>
            </View>
        )
    };

    const addStockEntry = async (quantity, scannedProduct) => {
        //get selected Product Id
        let selectedProductId = scannedProduct?.product_id;

        let unit_price = scannedProduct?.sale_price;

        //get store Id
        if (params.storeId && quantity && params.stockEntryId && selectedProductId) {
            //creae object
            let createObject = {
                quantity: quantity,
                stockEntryId: params.stockEntryId,
                storeId: params.storeId,
                productId: selectedProductId,
                unit_price: unit_price,
            }

            //set scan modal close
            setScanModalVisible(false);

            //add stock entry prodcuts
            StockEntryService.addStockEntryProducts(createObject, async (error, res) => {
                if (res) {

                    let stockEntryProductDetail = res.data && res.data.stockEntryProductDetail;

                    if (stockEntryProductDetail) {

                        let stockEntryObject = {
                            image: scannedProduct?.featured_media_url,
                            product_display_name: scannedProduct?.product_display_name,
                            name: scannedProduct?.product_name,
                            stockEntryProductId: stockEntryProductDetail?.id,
                            id: stockEntryProductDetail?.id,
                            quantity: quantity,
                            name: scannedProduct?.product_name,
                            product_id: scannedProduct?.product_id,
                            sale_price: scannedProduct?.sale_price,
                            mrp: scannedProduct?.mrp,
                        };
                        setSearchPhrase("")
                        setClicked("")

                        if (stockEntryProductList && stockEntryProductList.length > 0) {

                            stockEntryProductList.splice(0, 0, stockEntryObject);

                            stateRef.stockEntryProductList = stockEntryProductList;

                            setStockEntryProductList(stockEntryProductList);

                            setTotalProduct(stockEntryProductList.length);

                        } else {
                            let stockEntryproductList = [stockEntryObject];

                            stateRef.stockEntryProductList = stockEntryproductList;

                            setStockEntryProductList(stockEntryproductList);

                            setTotalProduct(1);
                        }
                    }
                }

            });
        }

    };

    const onScanAction = async (selectedProduct) => {

        const stockEntryProductList = stateRef?.stockEntryProductList;

        if (stockEntryProductList?.length > 0) {

            const productIds = new Set(stockEntryProductList.map(data => data?.product_id));

            if (productIds.has(selectedProduct?.product_id)) {

                const existingProduct = stockEntryProductList.find(data => data?.product_id === selectedProduct?.product_id);

                const updatedQuantity = existingProduct?.quantity ? existingProduct.quantity + 1 : 1;

                const returnObject = {
                    updatedQuantity: updatedQuantity,
                    product: existingProduct,
                    stockEntryProductId: existingProduct?.stockEntryProductId,
                    product_id: selectedProduct?.product_id
                };

                setProductExistModalOpen(true);
                setSelectedItem(returnObject.product);
                setQuantityUpdateObject(returnObject);
            } else {
                await addStockEntry(1, selectedProduct);
            }
        } else {
            await addStockEntry(1, selectedProduct);
        }
    };


    const getProducts = async (barCode) => {

        const updatedPriceProductList = await ProductService.getProductUpdatedPrice(barCode);

        if (updatedPriceProductList && updatedPriceProductList.length == 1) {

            onScanAction(updatedPriceProductList[0]);

        } else if (updatedPriceProductList && updatedPriceProductList.length > 1) {

            //set store product list
            setScannedProductList(updatedPriceProductList);

            setProductSelectModalOpen(true);

        } else {
            productNotFoundToggle();
        }
    }


    const handleScannedData = async (data) => {

        setScanModalVisible(false);

        //get bar code
        let barCode = data?.data;

        if (barCode) {

            //set scanned code
            setScannedCode(barCode);

            const updatedPriceProductList = await ProductService.getProductUpdatedPrice(barCode);

            if (updatedPriceProductList && updatedPriceProductList.length == 1) {

                onScanAction(updatedPriceProductList[0]);

            } else if (updatedPriceProductList && updatedPriceProductList.length > 1) {

                //set store product list
                setScannedProductList(updatedPriceProductList);

                setProductSelectModalOpen(true);

            } else {
                SyncService.SyncProduct(barCode, null, (response) => {
                    getProducts(barCode);
                })
            }

        }

    };

    const updateStockEntryProduct = async () => {
        if (quantityUpdateObject) {
            // update the quantity
            await updateStockEntry(quantityUpdateObject.updatedQuantity, quantityUpdateObject.stockEntryProductId);
        }
    }


    const toggle = () => {
        setScanModalVisible(!modalVisible)
    }

    const productNotFoundToggle = () => {
        setProductNotFoundModalOpen(!productNotFoundModalOpen);
    }

    const productEditModalToggle = () => {
        setProductEditModalOpen(!productEditModalOpen);
        clearRowDetail();
    }

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    }

    const productExistModalToggle = () => {
        setProductExistModalOpen(!productExistModalOpen);
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

    const FooterContent = (
        <>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", height: 50 }}>

            </View>
            <View style={{ flex: 1, flexDirection: "row", marginTop: 10 }}>
                <View style={{ flex: 0.5, justifyContent: "flex-end", alignItems: "center" }}>
                    <View style={{ width: "100%", }}>
                        <Button title={"Complete"} color={Color.BLACK} onPress={() => {
                            if (stockEntryProductList.length == 0) {
                                Alert.Error("Please add a Product to Complete")
                            } else {
                                updateStockEntryStatus();

                            }
                        }} />
                    </View>
                </View>


                <View style={{ flex: 0.5, justifyContent: "center", alignItems: "center", marginLeft: 2 }}>
                    <View style={{ width: "100%", }}>
                        <Button title={"Scan"} color={Color.COMPLETE} onPress={() => { addNew() }} />
                    </View>
                </View>

            </View>
        </>
    )


    const updatedQuantity = (quantity) => {
        if (selectedItem) {
            updateStockEntry(quantity, selectedItem?.stockEntryProductId);
        }
    }

    const productSelectModalToggle = () => {
        setProductSelectModalOpen(!productSelectModalOpen);
    }

    const productDeleteModalToggle = () => {
        setProductDeleteModalOpen(!productDeleteModalOpen)
    }

    const StockEntryUpdate = (selectedStore) => {
        if (selectedStore) {
            let updateData = {
                storeId: selectedStore.id
            }
            StockEntryService.UpdateStockEntry(params?.stockEntryId, updateData, async (error, response) => {
                if (response) {
                    navigation.navigate("StockEntry/Product", {
                        stockEntryId: params?.stockEntryId,
                        locationName: selectedStore?.name,
                        storeId: selectedStore?.id,
                        date: dateTime.UTCtoLocalTime(params?.date, "DD-MMM-YYYY"),
                        owner: params?.owner,
                        status: params?.status,
                    });
                }
            });
        }
    }

    /* Render flat list funciton end */
    return (
        <>
            <Layout
                title={"Stock Entry - Products"}
                showBackIcon={true}
                backButtonNavigationUrl={"StockEntry"}
                FooterContent={!searchPhrase && params.status !== StockEntry.STATUS_COMPLETED && activeTab === TabName.PRODUCTS ? FooterContent : null}
                defaultFooter={false}
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                >

                    {params.status !== StockEntry.STATUS_COMPLETED && (
                        <View >
                            <ScrollView>
                                <View style={{ width: '100%' }}>
                                    <SearchBar
                                        searchPhrase={searchPhrase}
                                        setSearchPhrase={setSearchPhrase}
                                        setClicked={setClicked}
                                        clicked={clicked}
                                        handleChange={handleSearchOnChange}
                                        noScanner
                                    />
                                </View>
                                {searchPhrase && storeProductList && storeProductList.length > 0 && (
                                    <View>
                                        <ProductSearch
                                            searchResult={storeProductList}
                                            productOnClick={onScanAction}
                                        />
                                    </View>
                                )}
                            </ScrollView>

                        </View>
                    )}

                    {params.status === StockEntry.STATUS_COMPLETED && (
                        <View style={styles.tabBar}>
                            <Tab
                                title={TabName.GENERAL}
                                isActive={activeTab === TabName.GENERAL}
                                onPress={() => setActiveTab(TabName.GENERAL)}
                            />
                            <Tab
                                title={`${TabName.PRODUCTS} (${totalProduct || 0})`}
                                isActive={activeTab === TabName.PRODUCTS}
                                onPress={() => setActiveTab(TabName.PRODUCTS)}
                            />
                        </View>
                    )}


                    {activeTab === TabName.GENERAL && (
                        <StoreCard
                            data={params?.locationName}
                            date={dateTime.UTCtoLocalTime(params?.date, "DD-MMM-YYYY")}
                            User={params?.owner}
                            userNavigationUrl={"StockEntry/OwnerSelect"}
                            navigationurl={"StoreSelector"}
                            params={{
                                stockEntryId: params?.stockEntryId,
                                locationName: params?.locationName,
                                storeId: params?.storeId,
                                date: dateTime.UTCtoLocalTime(params?.date, "DD-MMM-YYYY"),
                                owner: params?.owner,
                                status: params?.status,
                                onSelectStore: StockEntryUpdate
                            }
                            }
                            userNavigationParams={{
                                stockEntryId: params?.stockEntryId,
                                locationName: params?.locationName,
                                storeId: params?.storeId,
                                date: dateTime.UTCtoLocalTime(params?.date, "DD-MMM-YYYY"),
                                owner: params?.owner,
                                status: params?.status,
                                owner: params?.owner
                            }}
                        />

                    )}

                    {activeTab === TabName.PRODUCTS && (
                        <><BarcodeScanner
                            toggle={toggle}
                            modalVisible={modalVisible}
                            id={params?.id ? params?.id : params?.stockEntryId}
                            handleScannedData={handleScannedData} />
                            <ProductEditModal
                                modalVisible={productEditModalOpen}
                                toggle={productEditModalToggle}
                                item={selectedItem}
                                updateAction={updatedQuantity}
                                quantityOnChange={updatedQuantity} />
                            <DeleteModal
                                modalVisible={productDeleteModalOpen}
                                toggle={productDeleteModalToggle}
                                item={selectedItem}
                                updateAction={deleteStockProduct} />
                            <ConfirmationModal
                                toggle={productExistModalToggle}
                                modalVisible={productExistModalOpen}
                                title={AlertMessage.PRODUCT_ALREADY_EXIST}
                                description={AlertMessage.QUANTITY_INCREASE_MESSSAGE}
                                confirmLabel={"Confirm"}
                                cancelLabel={"Cancel"}
                                scanProduct={selectedItem}
                                ConfirmationAction={updateStockEntryProduct} />
                            <ConfirmationModal
                                toggle={productNotFoundToggle}
                                modalVisible={productNotFoundModalOpen}
                                title={AlertMessage.PRODUCT_NOT_FOUND}
                                description={`BarCode ID '${scannedCode}' not found please scan different code or add the product`}
                                confirmLabel={"Ok"}
                                ConfirmationAction={productNotFoundToggle} />
                            <ProductSelectModal
                                modalVisible={productSelectModalOpen}
                                toggle={productSelectModalToggle}
                                items={scannedProductList}
                                updateAction={onScanAction} />
                            {stockEntryProductList && stockEntryProductList.length > 0 && (
                                <>
                                    <SwipeListView
                                        data={stockEntryProductList}
                                        renderItem={renderItem}
                                        renderHiddenItem={renderHiddenItem}
                                        rightOpenValue={-150}
                                        previewOpenValue={-40}
                                        previewOpenDelay={3000}
                                        disableRightSwipe={true}
                                        disableLeftSwipe={params.status !== StockEntry.STATUS_COMPLETED ? false : true}
                                        closeOnRowOpen={true}
                                        keyExtractor={item => String(item.id)}
                                    />
                                </>
                            )}

                            {!searchPhrase && stockEntryProductList.length == 0 && (

                                <View style={{ paddingVertical: 250, alignItems: "center" }}>
                                    <FontAwesome5 name="receipt" size={20} color={Color.PRIMARY} />
                                    <Text style={{ fontWeight: "bold" }}>No Products Added</Text>
                                </View>
                            )}
                        </>
                    )}

                </ScrollView>
            </Layout>
        </>
    );
};

export default ProductList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    productEdit: {
        alignItems: 'center',
        bottom: 10,
        justifyContent: 'center',
        position: 'absolute',
        top: 10,
        width: 70,
        backgroundColor: 'grey',
        right: 0
    },
    tabBar: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: Color.WHITE,
        borderBottomWidth: 1,
        borderBottomColor: Color.LIGHT_GRAY,
    },
    productDelete: {
        alignItems: 'center',
        bottom: 10,
        justifyContent: 'center',
        position: 'absolute',
        top: 10,
        width: 70,
        backgroundColor: '#D11A2A',
        right: 70
    },
});

