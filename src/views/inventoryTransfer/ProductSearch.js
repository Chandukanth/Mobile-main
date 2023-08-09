// Import React and Component
import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView
} from "react-native";

import { useNavigation } from "@react-navigation/native";

// Search bar
import SearchBar from "../../components/SearchBar";

import ProductSearch from "../../components/ProductSearch";

import Layout from "../../components/Layout";

import InventoryTransferService from "../../services/InventoryTransferService";

import { useIsFocused } from "@react-navigation/native";

import { Color } from "../../helper/Color";

import AlertMessage from "../../helper/AlertMessage";

import ConfirmationModal from "../../components/Modal/ConfirmationModal";

import { FontAwesome5 } from "@expo/vector-icons";

import OnePortalDB from "../../lib/SQLLiteDB";

import Object from "../../lib/Object";

import dateTime from "../../lib/DateTime";

import TransferTypeReasonModal from "../../components/Modal/TransferTypeReasonModal";

import TransferTypeReasonService from '../../services/TransferTypeReasonService';

const ProductSelectScreen = (props) => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [storeProductList, setStoreProductList] = useState("");
  const [clicked, setClicked] = useState(true);
  const [inventoryProductList, setInventoryProductList] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [quantityUpdateObject, setQuantityUpdateObject] = useState({});
  const [scanProduct, setScanProduct] = useState("");
  const [search, setSearch] = useState(false);
  const [reasonSelectModalOpen, setReasonSelectModalOpen] = useState(false);
  const [lastAddedTransferProductId, setLastAddedTransferProductId] = useState("");
  const [transferTypeReasonList, setTransferTypeReasonList] = useState([]);

  let DB = OnePortalDB.open('oneportal.db');

  const stateRef = useRef();

  stateRef.storeProductList = storeProductList;

  let params = props?.route?.params;

  const isFocused = useIsFocused();

  const navigation = useNavigation();

  // render the inventory list function
  useEffect(() => {
    //sycn async storage products
    getInventoryProducts();
    getTransferTypeReasonList();
  }, [props, isFocused]);


  const getTransferTypeReasonList = () => {
    if (params && params.type) {

      let urlParams = { transferType: params.type, pagination: false }

      TransferTypeReasonService.search(urlParams, (err, response) => {
        if (response && response.data && response.data.data) {
          let reasonList = response.data.data;

          if (reasonList && reasonList.length > 0) {
            setTransferTypeReasonList(reasonList);
          }
        }
      })
    }
  }

  const getInventoryProducts = () => {
    if (params?.offlineMode) {
      //get inventory transfer list
      InventoryTransferService.getInventoryProducts(params.transferId, (error, inventoryProductList) => {
        setInventoryProductList(inventoryProductList)
      });
    } else {
      InventoryTransferService.getInventoryProductList(params.transferId, params?.fromLocationId, (error, inventoryProductList, totalQuantity) => {

        if (inventoryProductList) {
          setInventoryProductList(inventoryProductList);
        }
      })
    }
  }


  const updateInventoryProduct = async () => {
    if (quantityUpdateObject) {

      let transferProductId = params?.offlineMode ? quantityUpdateObject?.localTransferProductId : quantityUpdateObject?.inventoryTransferProductId;

      // update the quantity
      await updateInventory(quantityUpdateObject.updatedQuantity, transferProductId);
    }
  }

  const addInventoryProduct = async (selectedProduct) => {
    try {

      //validate already added product list
      if (inventoryProductList && inventoryProductList.length > 0) {

        //find the product already exist or not
        let productExist = inventoryProductList.find((data) => data.product_id == selectedProduct.product_id);

        //validate product exist or not
        if (productExist) {

          //get the updated quantity
          let updatedQuantity = productExist?.quantity ? productExist?.quantity + 1 : 1;

          //create return object
          let returnObject = {
            updatedQuantity: updatedQuantity,
            product: productExist,
            inventoryTransferProductId: productExist?.inventoryTransferProductId,
            quantity: productExist?.quantity,
            localTransferProductId: productExist?.local_transfer_product_id,
          }

          //set moda visiblity
          setModalVisible(true);

          //update quantity update object
          setQuantityUpdateObject(returnObject);

          setScanProduct(returnObject.product)

        } else {
          //add inventory product
          await addInventory(1, selectedProduct);
        }
      } else {
        //add inventory product
        await addInventory(1, selectedProduct);
      }
    } catch (err) {
    }
  };

  const handleChange = async (e) => {

    const products = await OnePortalDB.runQuery(DB, `SELECT * FROM product_index WHERE product_display_name LIKE '%${e}%' OR brand_name LIKE '%${e}%' OR barcode='${e}'`);

    setStoreProductList(products);

  };

  const addInventory = async (quantity, scannedProduct) => {
    try {

      //validate quantity and scanned prodcut exist or not
      if (scannedProduct) {

        if (params?.offlineMode) {

          let bodyData = {
            transfer_id: params.transferId,
            quantity: quantity,
            product_id: scannedProduct?.product_id,
            unit_price: scannedProduct?.sale_price,
            amount: scannedProduct?.sale_price,
            company_id: scannedProduct?.company_id,
            created_at: dateTime.DateAndTime(new Date())
          };

          let tranferProductObjectKeyValue = Object.getKeyValue(bodyData);


          await OnePortalDB.runQuery(DB, `INSERT INTO transfer_product (${tranferProductObjectKeyValue.keyString}) VALUES (${tranferProductObjectKeyValue.createPlaceHolderString})`, tranferProductObjectKeyValue.valuesArrray);

          getInventoryProducts();

          navigation.navigate("Transfer/ProductList", {
            transferId: params?.transferId,
            toLocationId: params?.toLocationId,
            fromLocationId: params?.fromLocationId,
            date: params?.date,
            type: params?.type,
            fromLocationName: params?.fromLocationName,
            toLocationName: params?.toLocationName,
            notes: params?.notes,
            currentStatusId: params?.currentStatusId,
            offlineMode: params?.offlineMode,
            filter:params?.filter,
            offlineMode: params?.offlineMode,
            printName: params?.printName
          });

        } else {
          let bodyData = {
            id: params.transferId,
            quantity: quantity,
            storeId: params?.toLocationId,
            productId: scannedProduct?.product_id,
          };

          InventoryTransferService.addInventoryProduct(bodyData, (error, response) => {

            if (response && response.data && response.data.transferProductDetails) {

              let transferProductDetail = response.data.transferProductDetails;

              getInventoryProducts();

              if (transferTypeReasonList && transferTypeReasonList.length > 1) {

                setLastAddedTransferProductId(transferProductDetail.id);

                setReasonSelectModalOpen(true);

              } else if (transferTypeReasonList && transferTypeReasonList.length == 1) {

                let transferTypeReasonDeail = transferTypeReasonList[0];

                let lastAddedTransferProductId = transferProductDetail.id;

                if (transferTypeReasonDeail) {

                  InventoryTransferService.updateInventoryProduct({ reasonId: transferTypeReasonDeail.id }, lastAddedTransferProductId, () => {

                    navigation.navigate("Transfer/ProductList", {
                      transferId: params?.transferId,
                      toLocationId: params?.toLocationId,
                      fromLocationId: params?.fromLocationId,
                      date: params?.date,
                      type: params?.type,
                      fromLocationName: params?.fromLocationName,
                      toLocationName: params?.toLocationName,
                      notes: params?.notes,
                      offlineMode: params?.offlineMode,
                      currentStatusId: params?.currentStatusId,
                      filter:params?.filter,
                      printName: params?.printName
                    });

                  });
                }
              } else {
                navigation.navigate("Transfer/ProductList", {
                  transferId: params?.transferId,
                  toLocationId: params?.toLocationId,
                  fromLocationId: params?.fromLocationId,
                  date: params?.date,
                  type: params?.type,
                  fromLocationName: params?.fromLocationName,
                  toLocationName: params?.toLocationName,
                  notes: params?.notes,
                  currentStatusId: params?.currentStatusId,
                  offlineMode: params?.offlineMode,
                  filter:params?.filter,
                  offlineMode: params?.offlineMode,
                  printName: params?.printName
                });
              }

            }

          })
        }

      }
    } catch (err) {

    }
  };

  const updateInventory = async (quantity, transferProductId) => {
    try {
      //validate quantity exist or not
      if (quantity && transferProductId) {

        if (params?.offlineMode) {

          //get unit price
          let unit_price = parseInt(scanProduct?.sale_price);

          let bodyData = {
            amount: parseFloat(unit_price) * quantity,
            quantity: quantity
          }

          let tranferProductObjectKeyValue = Object.getKeyValue(bodyData);

          //update the product data
          await OnePortalDB.runQuery(DB, `UPDATE transfer_product SET ${tranferProductObjectKeyValue.updatePlaceHolderArray} WHERE id=${transferProductId}`, tranferProductObjectKeyValue.valuesArrray);

          getInventoryProducts();
          //set moda visiblity
          setModalVisible(false);

          navigation.navigate("Transfer/ProductList", {
            transferId: params?.transferId,
            toLocationId: params?.toLocationId,
            fromLocationId: params?.fromLocationId,
            date: params?.date,
            type: params?.type,
            fromLocationName: params?.fromLocationName,
            toLocationName: params?.toLocationName,
            offlineMode: params?.offlineMode,
            currentStatusId : params?.currentStatusId,
            filter:params?.filter,
            printName: params?.printName
          });
        } else {
          //get unit price
          let unit_price = parseInt(scanProduct?.sale_price);

          let bodyData = {
            amount: parseFloat(unit_price) * quantity,
            quantity: quantity
          }

          InventoryTransferService.updateInventoryProduct(bodyData, transferProductId, () => {

            getInventoryProducts();
            //set moda visiblity
            setModalVisible(false);

            navigation.navigate("Transfer/ProductList", {
              transferId: params?.transferId,
              toLocationId: params?.toLocationId,
              fromLocationId: params?.fromLocationId,
              date: params?.date,
              type: params?.type,
              fromLocationName: params?.fromLocationName,
              toLocationName: params?.toLocationName,
              offlineMode: params?.offlineMode,
              currentStatusId : params?.currentStatusId,
              filter:params?.filter,
              printName: params?.printName
            });
          })
        }

      }
    } catch (err) {
    }
  };


  const toggle = () => {
    //set modal visible
    setModalVisible(!modalVisible)
    //set quantity update object
    setQuantityUpdateObject({});
  }

  const handleReasonOnclick = (selectedReason) => {

    if (lastAddedTransferProductId && selectedReason) {

      let bodyData = {
        reasonId: selectedReason.id
      }

      InventoryTransferService.updateInventoryProduct(bodyData, lastAddedTransferProductId, () => {

        setLastAddedTransferProductId("");

        setReasonSelectModalOpen(false);

        navigation.navigate("Transfer/ProductList", {
          transferId: params?.transferId,
          toLocationId: params?.toLocationId,
          fromLocationId: params?.fromLocationId,
          date: params?.date,
          type: params?.type,
          fromLocationName: params?.fromLocationName,
          toLocationName: params?.toLocationName,
          notes: params?.notes,
          offlineMode: params?.offlineMode,
          currentStatusId : params?.currentStatusId,
          filter:params?.filter,
          printName: params?.printName
        });
      });
    }
  }


  /* Render flat list funciton end */

  return (
    <Layout title="Product Search" buttonLabel={"Cancel"} params={{filter:params?.filter}} showBackIcon={true} buttonOnPress={() => { navigation.goBack() }} >
      <ScrollView>
        <ConfirmationModal
          toggle={toggle}
          modalVisible={modalVisible}
          title={AlertMessage.PRODUCT_ALREADY_EXIST}
          scanProduct={scanProduct}
          description={`Do you want to increase the quantity from ${quantityUpdateObject?.quantity}?`}
          confirmLabel={"Yes"}
          cancelLabel={"No"}
          ConfirmationAction={updateInventoryProduct}
        />

        {reasonSelectModalOpen && (
          <TransferTypeReasonModal modalVisible={reasonSelectModalOpen} transferTypeReasonList={transferTypeReasonList} onPress={handleReasonOnclick} />
        )}

        <View style={styles.container}>
          <SearchBar
            searchPhrase={searchPhrase}
            setSearchPhrase={setSearchPhrase}
            setClicked={setClicked}
            clicked={clicked}
            handleChange={handleChange}
            setSearch={setSearch}
            noScanner
            focus
          />
        </View>

        {/* Search Result view */}
        {searchPhrase && storeProductList.length > 0 ? (
          <View style={styles.SearchView}>
            <ProductSearch
              searchResult={storeProductList}
              productOnClick={addInventoryProduct}
            />
          </View>
        ) : (
          searchPhrase && storeProductList.length == 0 ? (
            <View style={{ paddingVertical: 250, alignItems: "center" }}>
              <FontAwesome5 name="receipt" size={20} color={Color.PRIMARY} />
              <Text style={{ fontWeight: "bold" }}>No Records Found</Text>
            </View>
          ) : ""
        )}
      </ScrollView>
    </Layout>

  );
};

export default ProductSelectScreen;

const styles = StyleSheet.create({
  container: {
    flex: 0.2,
    flexDirection: "column",
  },
  SearchView: {
    flex: 0.2,
  },
  spinnerTextStyle: {
    color: "#fff",
  },
});
