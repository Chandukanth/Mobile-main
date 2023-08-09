// Import React and Component
import React, { useState, useEffect } from "react";

import { StyleSheet, View, ScrollView, Button } from "react-native";

import { useIsFocused, useNavigation } from "@react-navigation/native";

//Buttons
import LoadMoreButton from "../../components/LoadMoreButton";

//search Bar
import SearchBar from "../../components/SearchBar/Search";

// Spinner
import Spinner from "../../components/Spinner";

//ProductCard UI
import ProductCard from "../../components/ProductCard";

//Footer and Header
import Layout from "../../components/Layout";

//noRecordFound Message
import NoRecordFound from "../../components/NoRecordFound"

import ConfirmationModal from "../../components/Modal/ConfirmationModal";

import BarcodeScanner from "../../components/BarcodeScanner";

import AlertMessage from "../../helper/AlertMessage";

import ProductSelectModal from "../../components/Modal/ProductSelectModal";

import { Card, Paragraph } from 'react-native-paper';

import StoreProductService from "../../services/StoreProductService";

import Tab from "../../components/Tab";

import TabName from '../../helper/Tab';

import { Color } from "../../helper/Color";

import QuantitySelectModal from "../../components/Modal/QuantitySelectModal";

import AsyncStorage from "@react-native-async-storage/async-storage";

//Helpers
import AsyncStorageConstants from "../../helper/AsyncStorage";

import InventoryTransferService from "../../services/InventoryTransferService";

import { MenuItem } from 'react-native-material-menu';

import StoreForm from "./components/StoreForm";

import StoreService from "../../services/StoreService";

const Detail = (props) => {

    const ActionMenu = {
        ALL_QUANTITY: "All",
        NO_STOCK_QUANTITY: "NoStock",
        EXCESS_QUANTITY: "Excess",
        SHORTAGE_QUANTITY: "Shortage"
    }

    //Loading
    const [isLoading, setIsLoading] = useState(false);
    //search
    const [searchPhrase, setSearchPhrase] = useState("");
    const [search, setSearch] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    //setting tha initial page
    const [page, setPage] = useState(1);
    //we need to know if there is more data
    const [HasMore, setHasMore] = useState(true);

    const isFocused = useIsFocused();

    const [modalVisible, setScanModalVisible] = useState(false);

    const [onScanValidation, setOnScanValidation] = useState(false);

    const [scannedCode, setScannedCode] = useState("");

    const [productNotFoundModalOpen, setProductNotFoundModalOpen] = useState(false);

    const [activeTab, setActiveTab] = useState(TabName.GENERAL);

    const [openQuantitySelectModal, setQunatitySelectModal] = useState(false);

    const [selectedProductId, setSelectedProductId] = useState("");

    const [defaultStoreId, setStoreId] = useState();

    const [selectedQuantity, setSelectedQuantity] = useState("");

    const [visible, setVisible] = useState(false)

    const [updatedProductList, setUpdatedProductList] = useState([])

    const [storeDetail, setStoreDetail] = useState("")

    const [selectedMenu, setSelectedMenu] = useState(ActionMenu.SHORTAGE_QUANTITY)

    const navigation = useNavigation();

    let params = props?.route?.params;


    //render first time
    useEffect(() => {
        if (isFocused) {
            let mount = true;

            mount && getStoreProductList({ page: page, stockType: selectedMenu });

            getStoreID();

            getStoreDetail();

            return () => {
                mount = false;
            };
        }
    }, [isFocused, navigation]);

    const getStoreID = async () => {
        await AsyncStorage.getItem(AsyncStorageConstants.SELECTED_LOCATION_ID).then((res) => setStoreId(res))
    }

    const getStoreDetail = () => {
        if (params?.storeId) {

            setIsLoading(true);
            StoreService.get(params?.storeId, (error, response) => {
                if (response && response.data && response.data.data) {
                    setStoreDetail(response.data.data);
                }
                setIsLoading(false);
            })
        }
    }


    const getStoreProductList = (paramsObject, callback) => {

        let allProducts = new Array();

        let params = { store_id: props?.route?.params?.storeId };

        if (paramsObject && paramsObject.searchTerm) {
            params.search = paramsObject.searchTerm
        }

        if (paramsObject && paramsObject.page) {
            params.page = paramsObject.page;
        }

        if (paramsObject && paramsObject.scannedCode) {
            params.code = paramsObject.scannedCode;
        }

        if (paramsObject && paramsObject.stockType) {
            params.stockType = paramsObject.stockType;
        }
        StoreProductService.searchProduct(params, (err, response) => {
            //validate response exist or not
            if (response && response.data && response.data.data) {

                let storeProductList = response.data.data;

                if (storeProductList && storeProductList.length > 0) {

                    for (let i = 0; i < storeProductList.length; i++) {

                        const { productIndex, id, min_quantity, max_quantity, requiredQuantity, quantity } = storeProductList[i];

                        if (productIndex) {
                            const { product_id, brand_name, category_name, barcode, featured_media_url, product_name, product_display_name, sale_price, size, status, mrp } = productIndex;

                            let productObject = {
                                brand: brand_name,
                                category: category_name,
                                image: featured_media_url,
                                name: product_name,
                                product_display_name: product_display_name,
                                sale_price: sale_price,
                                mrp: mrp,
                                product_id: product_id,
                                size: size,
                                status: status,
                                barcode: barcode,
                                id: id,
                                min_quantity,
                                max_quantity,
                                requiredQuantity,
                                quantity
                            }

                            allProducts.push(productObject);

                        }
                    }
                }


                if (paramsObject && paramsObject.returnList) {
                    return callback(allProducts)
                } else {
                    setUpdatedProductList(allProducts);
                }
            }

        })
    }

    //search results
    const handleChange = async (search) => {
        setSearchPhrase(search)
        //Api Call
        getStoreProductList({ searchTerm: search, stockType: selectedMenu }, (response) => { });
    };

    const toggle = () => {
        setScanModalVisible(!modalVisible);
        setOnScanValidation(false);
    }

    const productNotFoundToggle = () => {
        setProductNotFoundModalOpen(!productNotFoundModalOpen);
    }


    //render more list after click the load more button
    const LoadMoreList = async () => {
        try {
            setIsFetching(true);
            getStoreProductList({ searchTerm: searchPhrase, page: page + 1, returnList: true, stockType: selectedMenu }, (response) => {

                // Set response in state
                setUpdatedProductList((prevTitles) => {
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

    const handleScannedData = async (data) => {
        try {
            //get bar code
            let barCode = data?.data;

            //validate bar code exist and loading
            if (barCode && !onScanValidation) {

                setScanModalVisible(false);

                //set onscan validation value
                setOnScanValidation(true);

                //set scanned code
                setScannedCode(barCode);

                setSearchPhrase(barCode);

                getStoreProductList({ scannedCode: barCode, returnList: true, stockType: selectedMenu }, (response) => {

                    setUpdatedProductList(response);

                    setScannedCode("");

                    setOnScanValidation(false);
                })
            }
        } catch (err) {
            //set onscan validation
            setOnScanValidation(false);
        }
    };

    const quantitySelectModal = (item) => {
        if (item) {
            setSelectedProductId(item?.id);
            setSelectedQuantity(item?.requiredQuantity);
        }
        setQunatitySelectModal(true);
    }

    const quantitySelectModalToggle = () => {
        setQunatitySelectModal(!openQuantitySelectModal);
        setSelectedProductId("");
        setSelectedQuantity("");
    }

    const quantityOnChange = (value) => {
        if (value) {
            setSelectedQuantity(value.value);
        }
    }

    const handleReplenish = () => {
        if (params?.storeId && selectedQuantity && selectedProductId) {
            let bodyData = { toLocationId: params?.storeId, fromLocationId: defaultStoreId, quantity: selectedQuantity, productId: selectedProductId };
            InventoryTransferService.replenish(bodyData, (error, response) => {
                if (response) {
                    quantitySelectModalToggle()
                }
            })
        }
    }

    const onChangeActionMenu = async (selectedMenu) => {
        setSelectedMenu(selectedMenu);
        await getStoreProductList({ stockType: selectedMenu })
        setVisible(false);
    }

    let actionItems;
    if (activeTab == TabName.STOCK) {
        actionItems = [
            <MenuItem style={{ backgroundColor: selectedMenu == ActionMenu.ALL_QUANTITY ? Color.ACTIVE : "" }} onPress={() => {
                setVisible(true);
                onChangeActionMenu(ActionMenu.ALL_QUANTITY)
            }}> All
            </MenuItem>,
            <MenuItem style={{ backgroundColor: selectedMenu == ActionMenu.NO_STOCK_QUANTITY ? Color.ACTIVE : "" }} onPress={() => {
                setVisible(true);
                onChangeActionMenu(ActionMenu.NO_STOCK_QUANTITY)
            }}> No Stock
            </MenuItem>,
            <MenuItem style={{ backgroundColor: selectedMenu == ActionMenu.SHORTAGE_QUANTITY ? Color.ACTIVE : "" }} onPress={() => {
                setVisible(true);
                onChangeActionMenu(ActionMenu.SHORTAGE_QUANTITY)
            }}> Shortage
            </MenuItem>,
            <MenuItem style={{ backgroundColor: selectedMenu == ActionMenu.EXCESS_QUANTITY ? Color.ACTIVE : "" }} onPress={() => {
                setVisible(true);
                onChangeActionMenu(ActionMenu.EXCESS_QUANTITY)
            }}> Excess
            </MenuItem>
        ];
    }

    return (
        <Layout
            title={"Location Detail"}
            isLoading={isLoading}
            bottomToolBar={true}
            showActionMenu={activeTab == TabName.STOCK ? true : false}
            actionItems={actionItems}
            closeModal={visible}
        >
            <View style={styles.tabBar}>
                <Tab
                    title={TabName.GENERAL}
                    isActive={activeTab === TabName.GENERAL}
                    onPress={() => setActiveTab(TabName.GENERAL)}
                />
                <Tab
                    title={`${TabName.STOCK} `}
                    isActive={activeTab === TabName.STOCK}
                    onPress={() => setActiveTab(TabName.STOCK)}
                />
            </View>

            {activeTab == TabName.GENERAL && (
                <StoreForm
                    storeDetail={storeDetail}
                />
            )}

            {activeTab === TabName.STOCK && (
                <ScrollView
                >
                    <View style={styles.searchBar}>
                        <SearchBar
                            searchPhrase={searchPhrase}
                            setSearchPhrase={setSearchPhrase}
                            setClicked={setClicked}
                            clicked={clicked}
                            setSearch={setSearch}
                            onPress={getStoreProductList}
                            handleChange={handleChange}
                            openScanner={toggle}
                        />

                        <BarcodeScanner
                            toggle={toggle}
                            modalVisible={modalVisible}
                            handleScannedData={handleScannedData}
                            handleChange={handleChange}
                        />

                        <ConfirmationModal
                            toggle={productNotFoundToggle}
                            modalVisible={productNotFoundModalOpen}
                            title={AlertMessage.PRODUCT_NOT_FOUND}
                            description={`BarCode ID '${scannedCode}' not found please scan different code or add the product`}
                            confirmLabel={"Ok"}
                            ConfirmationAction={productNotFoundToggle}
                        />

                        {openQuantitySelectModal && (
                            <QuantitySelectModal Numbers={300} modalVisible={openQuantitySelectModal} toggle={quantitySelectModalToggle} value={selectedQuantity} ConfirmationAction={handleReplenish} onChange={quantityOnChange} />
                        )}

                    </View>
                    <View style={styles.container}>
                        <View>
                            {updatedProductList && updatedProductList.length > 0 ? (
                                updatedProductList.map((item) => {
                                    return (
                                        <View>
                                            <Card style={{ marginVertical: 5, borderColor: '#333', borderWidth: 0.1 }}>
                                                <Card.Content>
                                                    <ProductCard
                                                        noIcon
                                                        onPress={() => {
                                                            navigation.navigate("Products/Details", {
                                                                productId: item.id,
                                                                name: item.name,
                                                                product_name: item.product_name,
                                                                quantity: item.quantity,
                                                                brand: item.brand,
                                                                status: item.status,
                                                                brand_id: item.brand_id,
                                                                image: item.image,
                                                                category_id: item.category_id,
                                                                category: item.category,
                                                                size: item.size,
                                                                unit: item.unit,
                                                                mrp: item.mrp,
                                                                sale_price: item.sale_price,
                                                                barcode: item.barcode,
                                                                printName: item.print_name
                                                            });
                                                        }}
                                                        size={item.size}
                                                        unit={item.unit}
                                                        name={item.name}
                                                        image={item.image}
                                                        brand={item.brand}
                                                        sale_price={item.sale_price}
                                                        mrp={item.mrp}
                                                    />

                                                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
                                                        <Paragraph style={{ fontWeight: 'bold' }}>Available Quantity: {item.quantity}</Paragraph>

                                                        <Paragraph style={{ fontWeight: 'bold' }}>Required Quantity: {item.requiredQuantity}</Paragraph>
                                                    </View>
                                                    {item?.requiredQuantity > 0 && (
                                                        <View style={{ marginTop: 10 }}>
                                                            <Button title={"Replenish"} color={Color.PRIMARY} onPress={() => quantitySelectModal(item)} />
                                                        </View>
                                                    )}
                                                </Card.Content>
                                            </Card>
                                        </View>
                                    );
                                })
                            ) : (
                                <NoRecordFound styles={{ paddingVertical: 250, alignItems: "center" }} iconName="box-open" />
                            )}
                        </View>
                    </View>
                    {updatedProductList && updatedProductList.length > 0 && updatedProductList.length % 25 == 0 ? (
                        isFetching && HasMore ? (
                            <Spinner />
                        ) : !HasMore ? (
                            ""
                        ) : (
                            <LoadMoreButton onPress={LoadMoreList} />
                        )
                    ) : (
                        ""
                    )}
                </ScrollView>
            )}
        </Layout>
    );
};

export default Detail;

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
