// Import React and Component
import React, { useEffect, useState } from "react";

import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

//Footer and Header
import Layout from "../../components/Layout";

import SearchBar from "../../components/SearchBar";

import ProductSelectModal from "../../components/Modal/ProductSelectModal";

import ConfirmationModal from "../../components/Modal/ConfirmationModal";

import BarcodeScanner from "../../components/BarcodeScanner";

import AlertMessage from "../../helper/AlertMessage";

import Refresh from "../../components/Refresh";

import productService from "../../services/ProductService";

import ProductCard from "../../components/ProductCard";

import StoreProductService from "../../services/StoreProductService";

import ArrayList from "../../lib/ArrayList";

import { Card, Title, Badge } from 'react-native-paper';

import AddTransferModal from "./components/AddTransferModal";

import InventoryTransferService from "../../services/InventoryTransferService";

import StoreQuantityEditModal from "./components/StoreQuantityEditModal";

import { useForm } from "react-hook-form";

import { MenuItem } from 'react-native-material-menu';

import { Color } from "../../helper/Color";

import NoRecordFound from "../../components/NoRecordFound";

import SyncService from "../../services/SyncService";

import Button from "../../components/Button";

import { List } from 'react-native-paper';

import { SwipeListView } from "react-native-swipe-list-view";

const Replenish = (props) => {

    let params = props?.route?.params;

    //state
    const [productList, setProductList] = useState("");

    const [refreshing, setRefreshing] = useState(false);
    //search
    const [searchPhrase, setSearchPhrase] = useState("");

    const [clicked, setClicked] = useState(false);

    const [modalVisible, setScanModalVisible] = useState(false);

    const [scannedCode, setScannedCode] = useState("");

    const [productNotFoundModalOpen, setProductNotFoundModalOpen] = useState(false);

    const [productSelectModalOpen, setProductSelectModalOpen] = useState(false);

    const [searchParam, setSearchParam] = useState("");

    const [selectedProduct, setSelectedProduct] = useState("");

    const [replenishResponse, setReplenishStoreResponse] = useState("");

    const [openQuantitySelectModal, setQuantitySelectModal] = useState(false);

    const [selectedQuantity, setSelectedQuantity] = useState("");

    const [selectedRow, setSelectedRow] = useState("");

    const [storeQuantityEditModal, setStoreQuantityEditModal] = useState(false);

    const [isWareHouseQuantityUpdate, setIsWareHouseQuantityUpdate] = useState(false);

    const [replenishBy, setReplenishBy] = useState("order");

    const [showSearch, setShowSearch] = useState(false);

    const [visible, setVisible] = useState(false)

    const [showReplenishRequired, setShowReplenishRequired] = useState(true)

    const [showReplenished, setShowReplenished] = useState(false);

    const [showReplenishNotRequired, setShowReplenishNotRequired] = useState(false)

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (selectedRow) {
            if (selectedRow?.quantity != null) {
                setValue("quantity", { label: `${selectedRow?.quantity}`, value: `${selectedRow?.quantity}` });
            }

            if (selectedRow?.min_quantity != null) {
                setValue("min_quantity", { label: `${selectedRow?.min_quantity}`, value: `${selectedRow?.min_quantity}` })
            }

            if (selectedRow?.max_quantity != null) {
                setValue("max_quantity", { label: `${selectedRow?.max_quantity}`, value: `${selectedRow?.max_quantity}` })
            }
        } else {
            reset();
        }
    }, [selectedRow]);

    const loadInitialData = async () => {
        if (params && params.productId) {
            const updatedPriceProductList = await productService.getProductUpdatedPrice(null, params.productId);
            if (updatedPriceProductList && updatedPriceProductList.length > 0) {
                setSelectedProduct(updatedPriceProductList[0]);
                getReplenishStoreList(updatedPriceProductList[0]);
            }
        }
    }

    const toggle = () => {
        setScanModalVisible(!modalVisible);
    }

    const productNotFoundToggle = () => {
        setProductNotFoundModalOpen(!productNotFoundModalOpen);
    }

    const productSelectModalToggle = () => {
        setProductSelectModalOpen(!productSelectModalOpen);
    }

    const onProductClick = (item) => {
        setSelectedProduct(item);
        getReplenishStoreList(item);
    }

    //search results
    const handleChange = async (search) => {
        setSearchParam(search)
    };

    const onEndEditing = async () => {

        setShowReplenishRequired(true);

        if (searchParam) {

            let products = await productService.SearchFromLocalDB(searchParam);

            if (products && products.length == 1) {

                setSelectedProduct(updatedPriceProductList[0])

            } else if (products && products.length > 1) {

                //set store product list
                setProductList(products);

                setProductSelectModalOpen(true);

            }
        }
    }

    const getReplenishStoreList = (selectedProduct, OnChangeReplenishBy) => {
        try {

            let replenishFilter = OnChangeReplenishBy ? OnChangeReplenishBy : replenishBy

            if (selectedProduct) {

                StoreProductService.replenishSearch({ productId: selectedProduct.product_id, replenishBy: replenishFilter }, (err, response) => {

                    if (response && response.data) {

                        setReplenishStoreResponse(response.data);

                    }

                })

            }
        } catch (err) {
            console.log(err);
        }
    }


    const getProducts = async (barCode) => {

        const updatedPriceProductList = await productService.getProductUpdatedPrice(barCode);

        if (updatedPriceProductList && updatedPriceProductList.length == 1) {

            setSelectedProduct(updatedPriceProductList[0]);

            getReplenishStoreList(updatedPriceProductList[0]);

        } else if (updatedPriceProductList && updatedPriceProductList.length > 1) {

            //set store product list
            setProductList(updatedPriceProductList);

            setProductSelectModalOpen(true);

        } else {
            productNotFoundToggle();
        }
    }

    //scan product handler
    const handleScannedData = async (data) => {
        try {

            setScanModalVisible(false);

            setShowReplenishRequired(true);

            //get bar code
            let barCode = data?.data;

            //validate bar code exist and loading
            if (barCode) {

                //set scanned code
                setScannedCode(barCode);

                const updatedPriceProductList = await productService.getProductUpdatedPrice(barCode);

                if (updatedPriceProductList && updatedPriceProductList.length == 1) {

                    setSelectedProduct(updatedPriceProductList[0]);

                    getReplenishStoreList(updatedPriceProductList[0]);

                } else if (updatedPriceProductList && updatedPriceProductList.length > 1) {

                    //set store product list
                    setProductList(updatedPriceProductList);

                    setProductSelectModalOpen(true);

                } else {

                    SyncService.SyncProduct(barCode, null, (response) => {
                        getProducts(barCode);
                    })

                }

            }
        } catch (err) {
            console.log(err);
        }
    };

    const onClear = () => {
        setSelectedProduct("");
        setReplenishStoreResponse("");
    }


    const quantitySelectModalToggle = () => {
        setQuantitySelectModal(!openQuantitySelectModal);
        setSelectedRow("");
        setSelectedQuantity("");
    }

    const toggleQuantitySelectModal = () => {
        setStoreQuantityEditModal(false);
        setSelectedRow("");
        setIsWareHouseQuantityUpdate(false);
    }

    const quantityOnChange = (value) => {
        setSelectedQuantity(value);
    }

    const handleWareQuantityClick = () => {
        setStoreQuantityEditModal(true);
        setSelectedRow(replenishResponse?.distributionCenterStoreProducDetail);
        setIsWareHouseQuantityUpdate(true);
    }

    const handleStoreQuantityClick = (data) => {
        setSelectedRow(data);
        setStoreQuantityEditModal(true);
    }

    const handleReplenishClick = (data) => {
        setSelectedRow(data);
        setSelectedQuantity(data.replenishQuantity ? data.replenishQuantity : data.replenishedQuantity)
        setQuantitySelectModal(true);
    }

    const onReplenishHandler = () => {

        if (selectedQuantity >= 0) {

            let bodyData = { toLocationId: selectedRow?.store_id, quantity: selectedQuantity, productId: selectedRow?.productId };

            InventoryTransferService.replenish(bodyData, (error, response) => {
                if (response) {
                    quantitySelectModalToggle()
                    getReplenishStoreList(selectedProduct)
                }
            })
        }
    }

    const replenishAll = async () => {

        if (replenishResponse && ArrayList.isNotEmpty(replenishResponse.replenishStoreList)) {

            let replenishList = replenishResponse.replenishStoreList;

            let replenishBody = new Array();

            for (let i = 0; i < replenishList.length; i++) {
                replenishBody.push({
                    toLocationId: replenishList[i].store_id,
                    quantity: replenishList[i].replenishQuantity,
                    productId: replenishList[i].productId,
                })
            }

            InventoryTransferService.replenishAll({ replenishList: replenishBody }, () => {

                setVisible(false);

                onClear();

            });

        }
    }

    const storeProductUpdate = async (values) => {

        const data = new Object();

        let storeProductId = replenishResponse?.distributionCenterStoreProducDetail?.id;

        data.quantity = selectedQuantity;


        if (storeProductId) {

            StoreProductService.update(storeProductId, data, (err, response) => {
                if (response && response.data) {
                    getReplenishStoreList(selectedProduct);
                    toggleQuantitySelectModal(false);
                    setSelectedQuantity("")
                }
            });
        }
    };

    const renderItem = (items, quantityAttribute) => {
        let data = items?.item;
        return (
            <>
                <Card style={{ marginVertical: 5, borderColor: '#333', borderWidth: 0.1, borderBottomWidth: 0, backgroundColor: data.replenishQuantity > 0 ? data.storeColorCode ? data.storeColorCode : "#dc3545" : "#D3D3D3" }}>
                    <Card.Content style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", borderBottomColor: "white", borderBottomWidth: 1, paddingBottom: 5 }}>
                        <Title style={{ color: 'white' }}>{data.locationName}</Title>
                    </Card.Content>

                    <Card.Content >
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 10 }}>
                            <View>
                                <Text style={{ color: "white" }} variant="titleLarge">Min: {replenishBy == "order" ? data.minOrderQuantity : data.min_quantity}</Text>
                                <Text style={{ color: "white" }} variant="bodyMedium">Max: {replenishBy == "order" ? data.maxOrderQuantity : data.max_quantity}</Text>
                                <Text style={{ color: "white" }} variant="bodyMedium">Available: {data.tempQuantity}</Text>
                            </View>

                            {quantityAttribute && (
                                <View>
                                    <Text style={{ fontSize: 40, color: "white", fontWeight: "bold" }}>{data[quantityAttribute]}</Text>
                                </View>
                            )}
                        </View>
                    </Card.Content>
                </Card>
            </>
        )
    }

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    }

    const renderHiddenItem = (data, rowMap) => {
        return (
            <View style={styles.swipeStyle}>
                <TouchableOpacity
                    style={styles.actionDeleteButton}
                    onPress={() => {
                        closeRow(rowMap, data?.item.id);
                        handleReplenishClick(data?.item)
                    }}
                >
                    <Text style={styles.btnText}>{data?.item?.replenishQuantity ? "Complete" : "Update"}</Text>
                </TouchableOpacity>
            </View>

        )
    };

    const ReplenishCard = ({ replenishArray, quantityAttribute, title, expanded, onExpandClick }) => {

        return (
            <>
                {replenishArray && ArrayList.isNotEmpty(replenishArray) && (
                    <List.Section>
                        <List.Accordion title={title} expanded={expanded} onPress={onExpandClick} titleStyle={{ color: Color.BLACK, fontWeight: "bold" }}>

                            <SwipeListView
                                data={replenishArray}
                                renderItem={(rowData) => renderItem(rowData, quantityAttribute)}
                                renderHiddenItem={renderHiddenItem}
                                rightOpenValue={-80}
                                previewOpenValue={-40}
                                previewOpenDelay={3000}
                                disableRightSwipe={true}
                                closeOnRowOpen={true}
                                keyExtractor={item => String(item.id)}
                            />

                        </List.Accordion>
                    </List.Section>
                )}
            </>
        );
    }

    const onActionMenuClick = async (replenishBy) => {
        setVisible(true);
        setReplenishBy(replenishBy);
        await getReplenishStoreList(selectedProduct, replenishBy);
        setVisible(false);
    }

    const actionItems = [
        <>
            <MenuItem onPress={async () => {
                setVisible(true);
                await setShowSearch(!showSearch);
                setVisible(false);
            }}
            >
                Search
            </MenuItem>

            {selectedProduct && (
                <>
                    <MenuItem style={{ backgroundColor: replenishBy == "stock" ? Color.ACTIVE : "" }} onPress={() => {
                        onActionMenuClick("stock");
                    }}>
                        Stock
                    </MenuItem>

                    <MenuItem style={{ backgroundColor: replenishBy == "order" ? Color.ACTIVE : "" }} onPress={() => {
                        onActionMenuClick("order");
                    }}
                    >
                        Order
                    </MenuItem>
                </>
            )}
        </>
    ];

    return (
        <Layout
            title={"Replenishment"}
            showBackIcon
            showScanner
            showActionMenu={true}
            actionItems={actionItems}
            FooterContent={replenishResponse && ArrayList.isNotEmpty(replenishResponse.replenishStoreList) &&
                <Button title={"Complete All"} backgroundColor={Color.GREEN} onPress={() => replenishAll()} />}
            openScanner={toggle}
            closeModal={visible}
        >
            <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>

                <View style={styles.searchBar}>

                    {showSearch && (
                        <SearchBar
                            searchPhrase={searchPhrase}
                            setSearchPhrase={setSearchPhrase}
                            setClicked={setClicked}
                            clicked={clicked}
                            onPress={onClear}
                            onEndEditing={onEndEditing}
                            handleChange={handleChange}
                            noScanner
                        />
                    )}
                </View>

                <BarcodeScanner
                    toggle={toggle}
                    modalVisible={modalVisible}
                    handleScannedData={handleScannedData}
                />

                {productSelectModalOpen && (
                    <ProductSelectModal
                        modalVisible={productSelectModalOpen}
                        toggle={productSelectModalToggle}
                        items={productList}
                        updateAction={onProductClick}
                    />
                )}

                <ConfirmationModal
                    toggle={productNotFoundToggle}
                    modalVisible={productNotFoundModalOpen}
                    title={AlertMessage.PRODUCT_NOT_FOUND}
                    description={`BarCode ID '${scannedCode}' not found please scan different code or add the product`}
                    confirmLabel={"Ok"}
                    ConfirmationAction={productNotFoundToggle}
                />

                {openQuantitySelectModal && (
                    <AddTransferModal
                        modalVisible={openQuantitySelectModal}
                        toggle={quantitySelectModalToggle}
                        value={selectedQuantity}
                        ConfirmationAction={onReplenishHandler}
                        showQuantityIncrementButton
                        quantity={selectedRow && selectedRow.replenishQuantity ? selectedRow.replenishQuantity : selectedRow.replenishedQuantity}
                        quantityOnChange={quantityOnChange}
                        title={"Update Quantity"}
                        confirmButtonLabel={"Update"}
                    />
                )}

                {storeQuantityEditModal && (
                    <StoreQuantityEditModal
                        modalVisible={storeQuantityEditModal}
                        toggle={toggleQuantitySelectModal}
                        ConfirmationAction={handleSubmit(values => storeProductUpdate(values))}
                        quantityOnChange={quantityOnChange}
                        quantity={selectedRow?.quantity}
                    />
                )}

                {selectedProduct && (
                    <>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <View style={{ flex: 0.8 }}>
                                <ProductCard
                                    name={selectedProduct?.name || selectedProduct?.product_name}
                                    brand={selectedProduct.brand_name}
                                    mrp={selectedProduct.mrp}
                                    sale_price={selectedProduct.sale_price}
                                    image={selectedProduct.featured_media_url}
                                    noIcon
                                />
                            </View>
                            <View style={{ flex: 0.2 }}>
                                {replenishResponse && (
                                    <View style={styles.container}>
                                        <TouchableOpacity onPress={() => (handleWareQuantityClick())}>
                                            <View style={styles.circle}>
                                                <Text style={styles.bottomNumber}>{replenishResponse?.distributionCenterQuantity}</Text>
                                            </View>
                                        </TouchableOpacity>

                                    </View>
                                )}
                            </View>
                        </View>

                        {replenishResponse && (
                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={{ fontSize: 16 }}>{`Allocated: ${replenishResponse?.totalReplenishQuantity}`}</Text>
                                <Text style={{ fontSize: 16 }}>{`Balance: ${replenishResponse?.totalBalanceQuantity}`} </Text>
                            </View>
                        )}
                    </>
                )}


                <ReplenishCard
                    replenishArray={replenishResponse?.replenishStoreList}
                    quantityAttribute={"replenishQuantity"}
                    title="Replenishment Required"
                    expanded={showReplenishRequired}
                    onExpandClick={()=> setShowReplenishRequired(!showReplenishRequired)}
                />

                <ReplenishCard
                    replenishArray={replenishResponse?.replenishedStoreList}
                    quantityAttribute={"replenishedQuantity"}
                    title={"Replenished"}
                    expanded={showReplenished}
                    onExpandClick={()=> setShowReplenished(!showReplenishNotRequired)}
                />

                <ReplenishCard
                    replenishArray={replenishResponse?.noReplenishStoreList}
                    expanded={showReplenishNotRequired}
                    onExpandClick={()=> setShowReplenishNotRequired(!showReplenishNotRequired)}
                    title={"Replenishment Not Required"}
                />

                {!replenishResponse && !selectedProduct && (
                    <View style={{ flex: 1, paddingVertical: 300, alignItems: "center", justifyContent: "center" }}>
                        <Button title={"Scan Product"} backgroundColor={Color.GREEN} onPress={() => toggle()} />
                    </View>
                )}

            </Refresh>
        </Layout>
    );
};

export default Replenish;

const styles = StyleSheet.create({
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
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    circle: {
        width: 70,
        height: 70,
        borderRadius: 100,
        backgroundColor: '#009dda',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomNumber: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        position: 'absolute',
        top: 14,
    },
    topNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        position: 'absolute',
        bottom: 40,
    },
    line: {
        width: '100%',
        height: 2,
        backgroundColor: 'white',
        position: 'absolute',
        top: '50%',
    },
    swipeStyle: {
        flex: 1,
    },
    actionDeleteButton: {
        alignItems: 'center',
        bottom: 6,
        justifyContent: 'center',
        position: 'absolute',
        top: 6,
        width: 75,
        backgroundColor: Color.BLACK,
        right: 7,
    },
    btnText: {
        color: Color.WHITE,
    },
});
