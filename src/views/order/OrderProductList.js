import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Button,
  BackHandler,
  ScrollView,
} from "react-native";

import Layout from "../../components/Layout";

import { useNavigation } from "@react-navigation/native";

import { useIsFocused } from "@react-navigation/native";

import Spinner from "react-native-loading-spinner-overlay";

import AlertMessage from "../../helper/AlertMessage";

import ConfirmationModal from "../../components/Modal/ConfirmationModal";

import ProductCard from "../../components/ProductCard";

import { SwipeListView } from "react-native-swipe-list-view";

import ProductEditModal from "../../components/Modal/ProductEditModal";

import DeleteModal from "../../components/Modal/DeleteModal";

import BarcodeScanner from "../../components/BarcodeScanner";

import OrderService from "../../services/OrderService";

import ProductSelectModal from "../../components/Modal/ProductSelectModal";

import Order from "../../helper/Order";

import OrderProduct from "../../helper/OrderProduct";

import OnePortalDB from "../../lib/SQLLiteDB";

import orderService from "../../services/OrderService";

import FooterContent from "./components/FooterContent";

import NoRecordFound from "../../components/NoRecordFound";

import Tab from "../../components/Tab";

import StoreCard from "../../components/storeCard";

import Gereral from "./General";

import dateTime from "../../lib/DateTime";

import TabName from "../../helper/Tab";

import productService from "../../services/ProductService";

import Permission from "../../helper/Permission";

import AsyncStorageService from "../../services/AsyncStorageService";

import StatusService from "../../services/StatusServices";

import ObjectName from "../../helper/ObjectName";

import ProductService from "../../services/ProductService";

import ProductModal from "../../components/Modal/GeneralModal";

import { MenuItem, MenuDivider } from "react-native-material-menu";

import { FontAwesome5 } from "@expo/vector-icons";

import { Color } from "../../helper/Color";

import { CommonActions } from "@react-navigation/native";

import CurrencyFormat from "../../lib/Currency";

import ProductSearch from "../../components/ProductSearch";

import SearchBar from "../../components/SearchBar";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AlternativeColor from "../../components/AlternativeBackground";
import Label from "../../components/Label";
import PermissionService from "../../services/PermissionService";
import { useForm } from "react-hook-form";

import SyncService from "../../services/SyncService";

import Status from "../../helper/Status";
import CustomButton from "../../components/Button";
import Alert from "../../lib/Alert";
import Number from "../../lib/Number";


const Billing = (props) => {
  const id = props?.route?.params?.id;
  const params = props?.route?.params;

  const [scannedCode, setScannedCode] = useState("");
  const [modalVisible, setScanModalVisible] = useState(false);
  const [quantityUpdateObject, setQuantityUpdateObject] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productCompleteModalOpen, setProductCompleteModalOpen] =
    useState(false);
  const [orderCancelModal, setOrderCancelModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [productExistModalOpen, setProductExistModalOpen] = useState("");
  const [productDeleteModalOpen, setProductDeleteModalOpen] = useState(false);
  const [selectedRowMap, setSelectedRowMap] = useState("");
  const [scanProduct, setScanProduct] = useState("");
  const [productNotFoundModalOpen, setProductNotFoundModalOpen] =
    useState(false);
  const [orderProducts, setOrderProducts] = useState([]);
  const [productSelectModalOpen, setProductSelectModalOpen] = useState(false);
  const [scannedProductList, setScannedProductList] = useState([]);
  const [activeTab, setActiveTab] = useState(TabName.PRODUCTS);
  const [manageOther, setManageOther] = useState(false);
  const [statusId, setStatusId] = useState("");
  const [cancelStatus, setCancelStatus] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [orderDate, setOrderDate] = useState(new Date());
  const [orderDraftStatusId, setOrderDraftStatusId] = useState("");
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);
  const [storeProductList, setStoreProductList] = useState([]);
  const [filteredList, setFilteredList] = useState(0);
  const [orderNumber, setOrderNumber] = useState(null);
  const [isProductAdding, setIsProductAdding] = useState(false);
  const [permission, setPermission] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date(params.date));
  const [selectedShift, setSelectedShift] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [status, setStatus] = useState("");
  const [cancelPermission, setCancelPermission] = useState("");
  const [actionList, setActionList] = useState([])
  const [selectedPayment, setSelectedPayment] = useState('');

  const searchQuery = "...";
  // Remove special characters from the search query using a regular expression
  const sanitizedSearchQuery = searchQuery.replace(/[^\w\s]/gi, "");

  // Filter the list based on the sanitized search query
  const storeProductsList = Array.isArray(storeProductList)
    ? storeProductList.filter((item) =>
      item.product_display_name
        .toLowerCase()
        .includes(sanitizedSearchQuery.toLowerCase())
    )
    : [];

  // Check if the filtered list has any items or not

  const IsFocused = useIsFocused();

  const stateRef = useRef();

  const navigation = useNavigation();

  useEffect(() => {
    if (params.status == Order.STATUS_DRAFT || params?.isNewOrder) {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          return true;
        }
      );
      return () => backHandler.remove();
    }
  }, []);

  useEffect(() => {
    //get order products
    getOrderProducts();
    getStatusId();
    getActionItems()
  }, [IsFocused, props]);

  useEffect(() => {
    let mount = true;

    //get permission
    mount && getPermission(), editPermission();
    return () => {
      mount = false;
    };
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  useEffect(() => {
    if (params?.isNewOrder) {
      toggle();
    }
  }, [navigation]);

  const editPermission = async () => {
    const editPermission = await PermissionService.hasPermission(
      Permission.ORDER_EDIT
    );
    setPermission(editPermission);
    const cancelPermission = await PermissionService.hasPermission(
      Permission.ORDER_CANCEL
    );
    setCancelPermission(cancelPermission);
  };

  const getStatusId = async () => {
    let completedStatsuId = await StatusService.getStatusIdByName(
      ObjectName.ORDER,
      Status.GROUP_COMPLETED
    );

    let cancelledStatusId = await StatusService.getStatusIdByName(
      ObjectName.ORDER,
      Status.GROUP_CANCELLED
    );

    let orderProductFirstStatusId = await StatusService.getFirstStatus(
      ObjectName.ORDER_PRODUCT
    );

    setStatusId(completedStatsuId);

    setCancelStatus(cancelledStatusId);

    setOrderDraftStatusId(orderProductFirstStatusId);
  };

  const clearStackNavigate = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Order" }],
      })
    );
  };

  const handlePaymentChange = (value) => {
    setSelectedPayment(value);
  };

  const handleSearchOnChange = async (e) => {
    const products = await productService.SearchFromLocalDB(e);
    setStoreProductList(products);
  };

  const OnCancel = () => {
    let data = {
      status: cancelStatus,
    };
    if (!orderId || !id) {
      clearStackNavigate();
    }
    OrderService.updateOrder(orderId ? orderId : id, data, () => {
      clearStackNavigate();
    });
  };

  const getOrderProducts = async (UpdatedOrderId, callback) => {
    try {
      let orderIdValue = orderId ? orderId : id ? id : UpdatedOrderId;

      let params = { orderId: orderIdValue, pagination: false }

      if (orderIdValue) {
        //ge order products
        OrderService.getOrderProducts(
          params,
          (error, orderProducts, totalAmount, totalQuantity) => {
            let filteredOrderProdcts = orderProducts.filter(
              (product) => product.status !== Order.STATUS_CANCEL
            );
            callback && callback(orderProducts)

            //set order products
            setOrderProducts(orderProducts);

            // set non cancelled Products
            setFilteredList(filteredOrderProdcts);
            //set total amount
            setTotalAmount(totalAmount);

          }
        );
      }
    } catch (err) {
      console.error(err);
    }
  };


  const addNew = () => {
    //set scan modal open
    setScanModalVisible(true);
  };

  //delete order product
  const cancelOrderProduct = async () => {
    if (selectedItem) {
      OrderService.cancel(
        selectedItem.orderProductId,
        async (error, response) => {
          //close product select modal
          setProductExistModalOpen(false);
          //get store products
          getOrderProducts();
        }
      );
    }
  };

  const updateOrderProduct = (orderproductId) => {
    try {
      let orderIDValue = orderId ? orderId : id;

      if (orderIDValue && orderDraftStatusId && orderproductId) {
        let bodyDaya = {
          orderId: orderIDValue,
          quantity: 1,
          status: orderDraftStatusId,
          orderProductId: orderproductId,
        };

        OrderService.updateOrderProduct(orderproductId, bodyDaya, () => {
          getOrderProducts();
          setIsProductAdding(false);
          setSearchPhrase("");
          setClicked("");
        });
      }
    } catch (err) {
      console.log(err);
      setIsProductAdding(false);
    }
  };

  const addOrderProduct = async (
    quantity,
    scannedProduct,
    orderId,
    callback
  ) => {
    try {
      const BodyData = {
        orderId: orderId ? orderId : id,
        productId: scannedProduct.product_id,
        quantity: quantity,
        productPriceId: scannedProduct.productPriceId,
      };

      await OrderService.addOrderProduct(BodyData, async (error, res) => {

        if (!error && res.data) {

          if (orderProducts != undefined) {

            let statusDetail = await StatusService.get(res.data.statusId);

            orderProducts.splice(0, 0, {
              image: scannedProduct.featured_media_url,
              product_display_name: scannedProduct.product_display_name,
              name: scannedProduct.product_name,
              id: scannedProduct.product_id,
              orderId: orderId ? orderId : id,
              orderProductId: res.data.orderProductId,
              product_id: scannedProduct.product_id,
              brand_name: scannedProduct.brand_name,
              sale_price: scannedProduct.sale_price,
              mrp: scannedProduct.mrp,
              status: statusDetail ? statusDetail.name : "",
              statusId: statusDetail ? statusDetail.id : "",
              quantity: quantity,
            });

            const totalAmount = orderProducts.reduce((accumulator, currentValue) => Number.Get(accumulator) + (Number.Get(currentValue.sale_price, 0) * Number.Get(currentValue.quantity, 0)), 0);

            setTotalAmount(totalAmount);

            setOrderProducts(orderProducts);

            setFilteredList(orderProducts);
          }

          setSearchPhrase("");
          setStoreProductList("");
          setClicked("");
        }

        return callback();
      });
    } catch (err) {
      console.log(err);
    }
  };

  const updateOrderProductQuantity = async (quantity, orderProductId) => {
    try {
      //validate quantity exist or not
      if (orderProductId) {
        //create body data
        let BodyData = {
          orderId: orderId ? orderId : id,
          quantity: quantity,
          orderProductId: orderProductId,
          product_id: selectedItem?.product_id,
          orderDate: params?.date ? params?.date : orderDate,
        };

        if (
          selectedItem &&
          selectedItem.status == OrderProduct.STATUS_CANCEL &&
          orderDraftStatusId
        ) {
          BodyData.status = orderDraftStatusId;
        }

        await OrderService.updateOrderProduct(
          orderProductId,
          BodyData,
          async (error, response) => {
            if (response && response.data) {
              //close product select modal
              setProductExistModalOpen(false);
              //get store products
              getOrderProducts();

              setSearchPhrase("");

              setClicked("");

              setStoreProductList("");

              setIsProductAdding(false);
            }
          }
        );
      }
    } catch (err) {
      setIsProductAdding(false);
    }
  };

  const createOrderAddOrderProduct = async (quantity, scannedProduct) => {
    try {
      if (!id && !orderId) {
        let bodyObject = new Object();

        bodyObject.storeId = params?.storeId;

        bodyObject.sales_executive_user_id = params?.userId;

        bodyObject.createdBy = params?.userId;

        bodyObject.customer_phone_number = params?.customer_phone_number;

        orderService.createOrder(bodyObject, async (error, response) => {
          if (response && response.data) {
            setOrderDate(response.data.orderDetail.date);

            setOrderId(response.data.orderDetail.id);

            setOrderNumber(response.data.orderDetail.order_number);

            if (response && response.data) {
              addOrderProduct(
                quantity,
                scannedProduct,
                response.data.orderDetail.id,
                () => {
                  setIsProductAdding(false);
                }
              );
            } else {
              setIsProductAdding(false);
            }
          } else {
            setIsProductAdding(false);
          }
        });
      } else if (id || orderId) {
        let orderID = id ? id : orderId;

        if (orderID) {
          addOrderProduct(quantity, scannedProduct, orderID, () => {
            setIsProductAdding(false);
          });
        } else {
          setIsProductAdding(false);
        }
      }
    } catch (err) {
      setIsProductAdding(false);
    }
  };

  const validateProductInOrderProduct = async (selectedProduct) => {
    //validate already added product list
    if (orderProducts && orderProducts.length > 0) {
      //find if a product with the same product_id already exists
      let productDetail = orderProducts.find(
        (data) =>
          data.product_id == selectedProduct.product_id &&
          data.sale_price == selectedProduct.sale_price
      );

      if (productDetail) {
        if (productDetail.status != OrderProduct.STATUS_CANCEL) {
          //get the updated quantity
          let updatedQuantity = productDetail?.quantity
            ? productDetail?.quantity + 1
            : 1;

          //create return object
          let returnObject = {
            updatedQuantity: updatedQuantity,
            product: productDetail,
            orderProductId: productDetail?.orderProductId,
            product_id: selectedProduct?.product_id,
          };

          //update quantity update object
          setQuantityUpdateObject(returnObject);

          setScanProduct(returnObject.product);
          setSelectedItem(returnObject.product);

          //set moda visiblity
          setProductExistModalOpen(true);
        } else {
          // add order product since the barcode is different
          await updateOrderProduct(productDetail.orderProductId);
        }
      } else {
        // add order product since the barcode is different
        await createOrderAddOrderProduct(1, selectedProduct);
      }
    } else {
      // add inventory product since there are no products in the list
      await createOrderAddOrderProduct(1, selectedProduct);
    }
  };

  //Product search click product handler
  const productOnClick = async (selectedProduct) => {
    try {
      if (!isProductAdding) {
        setIsProductAdding(true);

        const updatedPriceProductList =
          await ProductService.getProductUpdatedPrice(
            null,
            selectedProduct.product_id
          );

        if (updatedPriceProductList && updatedPriceProductList.length == 1) {
          validateProductInOrderProduct(updatedPriceProductList[0]);
        } else if (
          updatedPriceProductList &&
          updatedPriceProductList.length > 1
        ) {
          //set store product list
          setScannedProductList(updatedPriceProductList);

          setProductSelectModalOpen(true);
        } else {
          productNotFoundToggle();

          setIsProductAdding(false);
        }
      }
    } catch (err) {
      console.log(err);
      setIsProductAdding(false);
    }
  };

  const getProducts = async (barCode) => {
    const updatedPriceProductList = await ProductService.getProductUpdatedPrice(
      barCode
    );

    if (updatedPriceProductList && updatedPriceProductList.length == 1) {
      validateProductInOrderProduct(updatedPriceProductList[0]);
    } else if (updatedPriceProductList && updatedPriceProductList.length > 1) {
      //set store product list
      setScannedProductList(updatedPriceProductList);

      setProductSelectModalOpen(true);
    } else {
      productNotFoundToggle();
    }
  };

  //scan product handler
  const handleScannedData = async (data) => {
    try {
      setScanModalVisible(false);

      //get bar code
      let barCode = data?.data;

      //validate bar code exist and loading
      if (barCode) {
        //set scanned code
        setScannedCode(barCode);

        const updatedPriceProductList =
          await ProductService.getProductUpdatedPrice(barCode);

        if (updatedPriceProductList && updatedPriceProductList.length == 1) {
          validateProductInOrderProduct(updatedPriceProductList[0]);
        } else if (
          updatedPriceProductList &&
          updatedPriceProductList.length > 1
        ) {
          //set store product list
          setScannedProductList(updatedPriceProductList);

          setProductSelectModalOpen(true);
        } else {
          SyncService.SyncProduct(barCode, null, (response) => {
            getProducts(barCode);
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const clearRowDetail = () => {
    if (stateRef) {
      const selectedItem = stateRef.selectedItem;
      const selectedRowMap = stateRef.selecredRowMap;
      if (selectedItem && selectedRowMap) {
        closeRow(selectedRowMap, selectedItem.inventoryTransferProductId);
        setSelectedItem("");
        setSelectedRowMap("");
        stateRef.selectedItem = "";
        stateRef.selecredRowMap = "";
      }
    }
  };

  const getPermission = async () => {
    let permissionList = await AsyncStorageService.getPermissions();
    if (permissionList) {
      permissionList = JSON.parse(permissionList);
      if (permissionList && permissionList.length > 0) {
        let manageOther =
          permissionList &&
            permissionList.find(
              (option) =>
                option.role_permission === Permission.ORDER_MANAGE_OTHERS
            )
            ? true
            : false;
        setManageOther(manageOther);
      }
    }
  };

  const productModalToggle = () => {
    setProductModalOpen(!productModalOpen);
    clearRowDetail();
  };

  const productCompleteModalToggle = () => {
    setProductCompleteModalOpen(!productCompleteModalOpen);
    setSelectedPayment("")
  };
  const orderCancelModalToggle = () => {
    setOrderCancelModal(!orderCancelModal);
  };

  const productDeleteModalToggle = () => {
    setProductDeleteModalOpen(!productDeleteModalOpen);
    clearRowDetail();
  };

  const productNotFoundToggle = () => {
    setProductNotFoundModalOpen(!productNotFoundModalOpen);
  };

  const productSelectModalToggle = () => {
    setProductSelectModalOpen(!productSelectModalOpen);
    setIsProductAdding(false);
  };

  const productExistModalToggle = () => {
    setProductExistModalOpen(!productExistModalOpen);
    setIsProductAdding(false);
  };

  const toggle = () => {
    //close the scan modal
    setScanModalVisible(!modalVisible);
  };

  const cashPaid = (value) => {
    let data = {
      payment_type: selectedPayment,
      status: statusId,
    };
    if (selectedPayment === 1) {
      data.cash = totalAmount
    }
    if (selectedPayment === 2) {
      data.upi = totalAmount
    }
    if (selectedPayment === 3) {
      if (value?.cash == 0 || value?.upi == 0) {
        return alert("Enter a valid amount")
      }
      let amount = parseInt(value?.cash) + parseInt(value?.upi)

      if (parseInt(amount) !== parseInt(totalAmount)) {
        return alert("amount not matched")
      }


      data.cash = value?.cash,
        data.upi = value?.upi
    }

    OrderService.updateOrder(orderId ? orderId : id, data, (err, res) => {
      if (res) {
        clearStackNavigate();
      }
    });
  };

  const productExistOnclick = () => {
    if (quantityUpdateObject) {
      updateOrderProductQuantity(
        quantityUpdateObject.updatedQuantity,
        quantityUpdateObject.orderProductId
      );
    }
  };

  const updateQuantity = (quantity) => {
    if (selectedItem) {
      updateOrderProductQuantity(quantity, selectedItem.orderProductId);
    }
  };

  const renderHiddenItem = (data, rowMap) => {
    let item = data?.item;

    const isOlderThan5Minutes = () => {
      const createdAt = new Date(item?.created_at);
      const currentTime = new Date();
      const differenceInMinutes = Math.floor(
        (currentTime - createdAt) / (1000 * 60)
      );
      return differenceInMinutes > 5;
    };

    return (
      <View style={styles.swipeStyle}>
        {item?.status != Order.STATUS_CANCEL && (
          <TouchableOpacity
            style={
              params?.status == Order.STATUS_DRAFT || params?.isNewOrder
                ? styles.productDelete
                : styles.actionDeleteButton
            }
            onPress={() => {
              if (isOlderThan5Minutes() && !manageOther) {
                Alert.Error("Contact your Admin to cancel the order");
              } else {
                productDeleteModalToggle();
                setSelectedItem(data?.item);
                setSelectedRowMap(rowMap);
                stateRef.selectedItem = data?.item;
                stateRef.selecredRowMap = rowMap;
                closeRow(rowMap, data?.item.orderProductId);
              }
            }}
          >
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
        )}
        {(params?.status == Order.STATUS_DRAFT || params?.isNewOrder) && (
          <TouchableOpacity
            style={styles.productEdit}
            onPress={() => {
              productModalToggle();
              setSelectedItem(data?.item);
              setSelectedRowMap(rowMap);
              stateRef.selectedItem = data?.item;
              stateRef.selecredRowMap = rowMap;
              closeRow(rowMap, data?.item.orderProductId);
            }}
          >
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const updateValue = async () => {
    let updateData = new Object();
    if (selectedUser) {
      updateData.sales_executive_user_id = parseInt(selectedUser);
    }
    if (selectedDate) {
      updateData.date = selectedDate;
    }
    if (selectedStore) {
      updateData.storeId = selectedStore;
    }
    if (selectedShift) {
      updateData.shift = selectedShift;
    }
    if (status) {
      updateData.status = parseInt(status);
    }
    await orderService.updateOrder(id, updateData, (err, response) => {
      if (response) {
        navigation.navigate("Order");
      }
    });
  };

  const renderItem = (data) => {
    let item = data?.item;
    let index = data?.index;
    const containerStyle = AlternativeColor.getBackgroundColor(index);
    return (
      <View style={styles.container}>
        <View>
          {item && (
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
              status={item.status}
              QuantityField
              editable
              alternative={containerStyle}
            />
          )}
        </View>

      </View>
    );
  };

  const getActionItems = () => {
    let actionItems = new Array();

    if (cancelPermission) {
      actionItems.push(
        <MenuItem onPress={() => setOrderCancelModal(true)}>
          Cancel Order
        </MenuItem>
      )
    }

    if (params.isNewOrder || (params && params?.status && params?.status == Order.STATUS_DRAFT)) {
      return null
    } else {
      actionItems.push(
        <MenuItem
          onPress={() =>
            navigation.navigate("Order/Invoice", {
              item: {
                id: orderId ? orderId : id,
                order_number: orderNumber ? orderNumber : params.orderNumber,
              },
            })
          }
        >
          View Invoice
        </MenuItem>
      )
    }

    setActionList(actionItems)

  }



  return (
    <Layout
      title={
        orderNumber || params.orderNumber
          ? `Order# ${orderNumber ? orderNumber : params.orderNumber}`
          : "Order"
      }
      showActionMenu={actionList && actionList.length > 0 ? true : false}
      actionItems={actionList}
      showBackIcon={
        params?.isNewOrder || params?.status == Order.STATUS_DRAFT
          ? false
          : true
      }
      defaultFooter={
        params?.status == Order.STATUS_DRAFT || params?.isNewOrder
          ? true
          : false
      }
      emptyMenu={
        params?.status == Order.STATUS_DRAFT || params?.isNewOrder
          ? true
          : false
      }
      HideSideMenu={
        params?.status == Order.STATUS_DRAFT || params?.isNewOrder
          ? true
          : false
      }
      FooterContent={
        activeTab === TabName.SUMMARY ? (
          <CustomButton
            title={"COMPLETE"}
            backgroundColor={Color.SAVE_BUTTON}
            show={permission ? true : false}
            onPress={handleSubmit((values) => {
              updateValue(values);
            })}
          />
        ) : (
          ""
        )
      }
    >
      {orderCancelModal && (
        <ProductModal
          modalVisible={orderCancelModal}
          button1Press={() => OnCancel()}
          content={
            orderProducts.length > 0
              ? `Are you sure, you want to cancel this order?`
              : `No Products Added. Are you sure, you want to cancel this order?`
          }
          toggle={orderCancelModalToggle}
          button1Label="Yes"
          button2Label="No"
          title="Cancel Order"
          button2Press={() => setOrderCancelModal(false)}
        />
      )}


      {params?.status == Order.STATUS_DRAFT || params?.isNewOrder ? (
        <View>
          <ScrollView>
            <View style={{ width: searchPhrase ? "100%" : "85%" }}>
              <SearchBar
                searchPhrase={searchPhrase}
                setSearchPhrase={setSearchPhrase}
                setClicked={setClicked}
                clicked={clicked}
                handleChange={handleSearchOnChange}
                noScanner
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                position: "relative",
              }}
            >
              {!searchPhrase && (
                <>
                  <MaterialCommunityIcons
                    name={`cart-outline`}
                    size={26}
                    color="#000"
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "80%",
                      transform: [{ translateY: -45 }],
                    }}
                  />

                  <View style={{ position: "absolute", right: 0 }}>
                    <View
                      style={{
                        backgroundColor: "#ff0000",
                        borderRadius: 10,
                        position: "absolute",
                        right: 10,
                        top: "80%",
                        transform: [{ translateY: -56 }],
                        width: 18,
                        height: 18,
                        borderRadius: 14,
                      }}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 12,
                          textAlign: "center",
                          lineHeight: 18,
                        }}
                      >
                        {filteredList.length || 0}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>

            {searchPhrase &&
              storeProductList &&
              storeProductsList.length > 0 && (
                <View>
                  <ProductSearch
                    searchResult={storeProductList}
                    productOnClick={productOnClick}
                  />
                </View>
              )}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.tabBar}>
          <>
            <Tab
              title={TabName.SUMMARY}
              isActive={activeTab === TabName.SUMMARY}
              onPress={() => setActiveTab(TabName.SUMMARY)}
            />
            <Tab
              title={`${TabName.PRODUCTS} (${(orderProducts && orderProducts.length) || 0
                })`}
              isActive={activeTab === TabName.PRODUCTS}
              onPress={() => setActiveTab(TabName.PRODUCTS)}
            />
          </>
        </View>
      )}
      {activeTab === TabName.SUMMARY && (
        <Gereral
          permission={permission}
          param={params}
          setSelectedDate={setSelectedDate}
          setSelectedShift={setSelectedShift}
          setSelectedStore={setSelectedStore}
          setSelectedUser={setSelectedUser}
          selectedDate={selectedDate}
          setStatus={setStatus}
          status={status}
        />
      )}

      {activeTab === TabName.PRODUCTS && (
        <View style={{ flex: 1 }}>
          <View
            style={
              orderProducts && orderProducts.length > 0
                ? { flex: 0.8 }
                : { flex: 0.8, justifyContent: "center", alignItems: "center" }
            }
          >

            {!searchPhrase && orderProducts && orderProducts.length > 0 ? (
              <>
                <ScrollView>
                  <SwipeListView
                    data={orderProducts}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItem}
                    rightOpenValue={
                      params?.status == Order.STATUS_DRAFT || params?.isNewOrder
                        ? -150
                        : -80
                    }
                    previewOpenValue={-40}
                    previewOpenDelay={3000}
                    closeOnRowOpen={true}
                    keyExtractor={(item) => String(item.orderProductId)}
                    disableLeftSwipe={
                      params?.isNewOrder || manageOther ? false : true
                    }
                    disableRightSwipe={true}
                  />

                </ScrollView>
              </>

            ) : storeProductsList.length == 0 &&
              orderProducts &&
              orderProducts.length == 0 ? (
              <View style={{ alignItems: "center" }}>
                <FontAwesome5 name="box-open" size={20} color={Color.PRIMARY} />
                <Label text="No Products Added Yet" bold={true} />
              </View>
            ) : (
              <Spinner />
            )}

          </View>

          {modalVisible && (
            <BarcodeScanner
              toggle={toggle}
              modalVisible={modalVisible}
              id={orderId ? orderId : id}
              handleScannedData={handleScannedData}
            />
          )}

          {productDeleteModalOpen && (
            <DeleteModal
              modalVisible={productDeleteModalOpen}
              toggle={productDeleteModalToggle}
              item={selectedItem}
              updateAction={cancelOrderProduct}
              heading={AlertMessage.CANCEL_MODAL_TITLE}
              description={AlertMessage.CANCEL_MODAL_DESCRIPTION}
            />
          )}

          {productModalOpen && (
            <ProductEditModal
              modalVisible={productModalOpen}
              toggle={productModalToggle}
              item={selectedItem}
              updateAction={updateQuantity}
              quantityOnChange={updateQuantity}
            />
          )}
          {productCompleteModalOpen && (
            <ProductModal
              modalVisible={productCompleteModalOpen}
              button1Press={(value) => cashPaid(value)}
              content={`Total Amount  `}
              content2={`${CurrencyFormat.IndianFormat(totalAmount)}`}
              toggle={productCompleteModalToggle}
              button1Label="PAID"
              title="Complete Order"
              handlePaymentChange={handlePaymentChange}
              selectedPayment={selectedPayment}
            />
          )}


          <View style={{ flex: 0.2 }}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                height: 30,
              }}
            >
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 19,
                    letterSpacing: 1,
                    paddingTop: 20,
                  }}
                >
                  Total Amount:&nbsp;&nbsp;
                  <Text style={{ color: "red", letterSpacing: 1 }}>
                    {CurrencyFormat.IndianFormat(totalAmount)}
                  </Text>
                </Text>
              </View>
            </View>

            {((!productExistModalOpen &&
              !productNotFoundModalOpen &&
              params?.status == Order.STATUS_DRAFT) ||
              params?.isNewOrder) && (
                <FooterContent
                  id={orderId ? orderId : id}
                  storeId={params.storeId}
                  locationName={params?.locationName}
                  shift={params?.shift}
                  salesExecutive={params?.salesExecutive}
                  date={params?.date ? params?.date : orderDate}
                  addNew={addNew}
                  onPress={() =>
                    orderProducts.length > 0
                      ? setProductCompleteModalOpen(true)
                      : setOrderCancelModal(true)
                  }
                  orderProducts={orderProducts}
                  totalAmount={totalAmount}
                  cashPaid={cashPaid}
                />
              )}
          </View>

          {productNotFoundModalOpen && (
            <ConfirmationModal
              toggle={productNotFoundToggle}
              modalVisible={productNotFoundModalOpen}
              title={AlertMessage.PRODUCT_NOT_FOUND}
              description={`BarCode ID '${scannedCode}' not found please scan different code or add the product`}
              confirmLabel={"Ok"}
              ConfirmationAction={productNotFoundToggle}
            />
          )}

          {productExistModalOpen && (
            <ConfirmationModal
              toggle={productExistModalToggle}
              scanProduct={scanProduct}
              modalVisible={productExistModalOpen}
              title={AlertMessage.PRODUCT_ALREADY_EXIST}
              description={AlertMessage.QUANTITY_INCREASE_MESSSAGE}
              confirmLabel={"Yes"}
              cancelLabel={"No"}
              ConfirmationAction={productExistOnclick}
              CancelAction={() => productExistModalToggle()}
            />
          )}

          {productSelectModalOpen && (
            <ProductSelectModal
              modalVisible={productSelectModalOpen}
              toggle={productSelectModalToggle}
              items={scannedProductList}
              updateAction={validateProductInOrderProduct}
            />
          )}
        </View>
      )}
    </Layout>
  );
};
export default Billing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "scroll",
    backgroundColor: "#fff",
  },
  productImage: {
    width: 30,
    height: 30,
    borderRadius: 5,
    borderWidth: 2,
  },
  productImage: {
    width: 30,
    height: 30,
    borderRadius: 5,
    borderWidth: 2,
  },
  swipeStyle: {
    flex: 1,
  },
  actionDeleteButton: {
    alignItems: "center",
    bottom: 10,
    justifyContent: "center",
    position: "absolute",
    top: 16,
    width: 70,
    backgroundColor: "#D11A2A",
    right: 7,
  },
  btnText: {
    color: Color.WHITE,
  },
  productEdit: {
    alignItems: "center",
    bottom: 10,
    justifyContent: "center",
    position: "absolute",
    top: 10,
    width: 70,
    backgroundColor: "grey",
    right: 0,
  },
  tabBar: {
    flexDirection: "row",
    height: 50,
    backgroundColor: Color.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: Color.LIGHT_GRAY,
  },
  productDelete: {
    alignItems: "center",
    bottom: 10,
    justifyContent: "center",
    position: "absolute",
    top: 10,
    width: 70,
    backgroundColor: "#D11A2A",
    right: 70,
  },
});
