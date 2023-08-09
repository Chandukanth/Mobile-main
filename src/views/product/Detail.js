// Import React and Component
import React, { useState, useEffect } from "react";

import { StyleSheet, Text, TouchableOpacity, NativeModules, View, FlatList, Button } from "react-native";

import { useForm } from "react-hook-form";

import { useNavigation } from "@react-navigation/native";

// Storage

import AsyncStorage from "@react-native-async-storage/async-storage";

//Helpers

import AsyncStorageConstants from "../../helper/AsyncStorage";

import { weightUnitOptions } from "../../helper/product";

import { statusOptions } from "../../helper/product";

import { Color } from "../../helper/Color";

import { StatusText } from "../../helper/product";



//Services

import categoryService from "../../services/CategoryService";

import brandService from "../../services/BrandService";

import ProductService from "../../services/ProductService";

import MediaService from "../../services/MediaService";

//COMPONENTS

import ProductForm from "./components/ProductForm";

import Layout from "../../components/Layout";

import SpinnerOverlay from "react-native-loading-spinner-overlay";

import { MenuItem } from 'react-native-material-menu';

import CountSelectModal from "../../components/Modal/CountSelectModal";

import OnePortalDB from "../../lib/SQLLiteDB";

import Toast from 'react-native-simple-toast';
import ObjectLib from "../../lib/Object";

import Setting from "../../lib/Setting";

import storeProductService from "../../services/StoreProductService";

import Tab from "../../components/Tab";

import TabName from '../../helper/Tab';

import { Card, Title, Paragraph } from 'react-native-paper';

import QuantitySelectModal from "../../components/Modal/QuantitySelectModal";

import InventoryTransferService from "../../services/InventoryTransferService";

import NoRecordFound from "../../components/NoRecordFound";

import ReplenishCard from "./components/ReplenishCard";

const { BluetoothManager } = NativeModules;

let BlueTooth;

if (BluetoothManager) {
  BlueTooth = require("../../services/BluetoothService");
}

const ProductDetails = (props) => {

  const ActionMenu = {
    ALL_QUANTITY: "All",
    NO_STOCK_QUANTITY: "NoStock",
    EXCESS_QUANTITY: "Excess",
    SHORTAGE_QUANTITY: "Shortage"
  }

  const [brandValue, setBrandValue] = useState();
  const [categoryValue, setCategoryValue] = useState();
  const [brandList, setBrandList] = useState();
  const [categoryList, setCategoryList] = useState();
  const [unit, setUnit] = useState();
  const [status, setStatus] = useState();
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [overlayLoader, setOverlayLoader] = useState(null);
  const [openCopySelectModal, setShowNumberOfCopySelectModal] = useState(false);
  const [numberofCopies, setNumberofCopies] = useState("");
  const [activeTab, setActiveTab] = useState(TabName.LOCATION);
  const [openQuantitySelectModal, setQuantitySelectModal] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState("");
  const [storeID, setSelectedLocationId] = useState("");
  const [defaultStoreId, setStoreId] = useState();
  const [visible, setVisible] = useState(false)
  const [updatedStoreproductList, setUpdatedStoreProductList] = useState([])
  const [selectedMenu, setSelectedMenu] = useState(ActionMenu.SHORTAGE_QUANTITY)
  const [isLoading, setIsLoading] = useState(false);

  // render the inventory list function
  let details = props.route.params;
  const navigation = useNavigation();

  let DB = OnePortalDB.open('oneportal.db')

  useEffect(() => {
    let mount = true;
    mount && brandService.getBrandList(setBrandList);
    mount && categoryService.getCategoryList(setCategoryList);

    getStoreProductList(true, selectedMenu);
    getStoreID();
    //cleanup function
    return () => {
      mount = false;
    };
  }, []);

  const getStoreProductList = (pageLoad, selectedMenu) => {

    let storeProductList = new Array();


    pageLoad && setIsLoading(true);
    storeProductService.replenishSearch({ productId: details.productId, status: "Active" }, (err, response) => {
      //validate response exist or not
      if (response && response.data && response.data.data) {

        let storeProduct = response.data.data;

        if (storeProduct && storeProduct.length > 0) {

          for (let i = 0; i < storeProduct.length; i++) {

            const { locationName, store_id, quantity, min_quantity, max_quantity, requiredQuantity, replenishQuantity, last_order_date, last_stock_entry_date, order_quantity, updatedQuantity, replenishedQuantity } = storeProduct[i];

            let storeProductObject = {
              locationName: locationName,
              store_id: store_id,
              quantity: quantity,
              min_quantity: min_quantity,
              max_quantity: max_quantity,
              requiredQuantity: requiredQuantity,
              replenishQuantity: replenishQuantity,
              lastOrderDate: last_order_date,
              lastStockEntryDate: last_stock_entry_date,
              updatedQuantity: updatedQuantity,
              orderQuantity: order_quantity,
              updatedQuantity: updatedQuantity,
              replenishedQuantity: replenishedQuantity
            }

            storeProductList.push(storeProductObject)

          }
        }
      }

      setUpdatedStoreProductList(storeProductList);

      pageLoad && setIsLoading(false);

    })
  }

  const getStoreID = async () => {
    await AsyncStorage.getItem(AsyncStorageConstants.SELECTED_LOCATION_ID).then((res) => setStoreId(res))
  }


  const preloadedValues = {
    name: details?.name,
    sale_price: details && details.sale_price && details.sale_price.toString(),
    barcode: details.barcode,
    size: details.size,
    mrp: details && details.mrp && details.mrp.toString(),
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: preloadedValues,
  });

  const UpdateProducts = async (values) => {
    try {
      if (values.name) {


        let bodyData = {
          name: values.name,
          brand_id: brandValue ? brandValue.value : details.brand_id,
          category_id: categoryValue
            ? categoryValue.value
            : details.category_id,
          sale_price: values.sale_price,
          mrp: values.mrp,
          barcode: values.barcode,
          Size: values.size,
          Unit: unit ? unit.value : "",
          status: status ? status.value : StatusText(details.status),
        };

        ProductService.updateProduct(navigation, bodyData, details.productId, (error, response) => {
          if (response && response.data) {
            if (file && image) {
              setOverlayLoader(true);
              uploadImage(() => {
                setOverlayLoader(false);
                ProductService.reindex(details.productId, () => { })
                navigation.navigate("Products");
              });
            }
            navigation.navigate("Products");
          }
        }
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const uploadImage = (callback) => {
    if (props.route.params.productId && file) {
      const data = new FormData();

      let mediaFile = {
        type: file?._data?.type,
        size: file?._data.size,
        uri: image,
        name: file?._data.name,
      };

      data.append("media_file", mediaFile);

      data.append("image_name", file?._data.name);

      data.append("name", file?._data.name);

      data.append("media_name", file?._data.name);

      data.append("object", "PRODUCT");

      data.append("object_id", props.route.params.productId);

      data.append("media_url", image);

      data.append("media_visibility", 1);

      data.append("feature", 1);

      MediaService.uploadMedia(navigation, data, (error, response) => {
        //reset the state
        setFile("");
        return callback();
      });
    } else {
      return callback();
    }
  };

  const onPrintClickHandler = async () => {

    let bluetoothDevices = await OnePortalDB.runQuery(DB, `SELECT * FROM setting WHERE name='${Setting.BLUETOOTH_PRINTER_SETTING}'`);

    if (bluetoothDevices && bluetoothDevices.length > 0) {

      let deviceDetail = bluetoothDevices[0];

      if (deviceDetail) {

        let address = deviceDetail.value;

        await BlueTooth.Connect(address)

        if (numberofCopies && numberofCopies > 0) {
          for (let i = 0; i < numberofCopies; i++) {
            await printPriceLabel(i);
          }
          setShowNumberOfCopySelectModal(false);
        }
      }
    } else {
      Toast.show("Printer Not Connected");
    }
  }

  const toggleModal = () => {
    setShowNumberOfCopySelectModal(!openCopySelectModal);
  }

  const OnSelectNumberOfCopy = (selectedValue) => {
    if (selectedValue) {
      setNumberofCopies(parseInt(selectedValue.value));
    }
  }

  const printPriceLabel = async (i) => {
    try {
      let productName = details.printName ? details.printName : details.name;

      let barCode = details?.barcode ? details?.barcode : details.productId;

      let mrp = details?.mrp ? details?.mrp : null;

      await BlueTooth.PrintPriceLabel(barCode, productName, details.sale_price, mrp, i + 1)
    } catch (err) {
      console.log(err);
    }
  }

  const onHandleLablePrintClick = async () => {
    let bluetoothDevices = await OnePortalDB.runQuery(DB, `SELECT * FROM setting WHERE name='${Setting.BLUETOOTH_PRINTER_SETTING}'`);

    if (bluetoothDevices && bluetoothDevices.length > 0) {
      setShowNumberOfCopySelectModal(true)
    } else {
      navigation.navigate("Bluetooth/Setting");
    }
  }

  const handleReplenish = (item) => {

    let updatedQuantity = selectedQuantity ? selectedQuantity : item && item.replenishQuantity;

    let updatedStoreId = storeID ? storeID : item && item.store_id

    if (updatedStoreId && updatedQuantity) {

      let bodyData = { toLocationId: updatedStoreId, fromLocationId: defaultStoreId, quantity: updatedQuantity, productId: details?.productId };

      InventoryTransferService.replenish(bodyData, (error, response) => {
        if (response) {
          closeQuantityModal();
          getStoreProductList(false,selectedMenu);
        }
      })
    } else {
      Toast.show("Missing Required Fields", Toast.LONG);
    }
  }

  const quantityOnChange = (value, item) => {
    if (item) {
      setSelectedLocationId(item?.store_id);
      setSelectedQuantity(value);
    } else if (value) {
      setSelectedQuantity(value.value);
    }
  }

  const quantitySelectModal = (item) => {
    if (item) {
      setSelectedLocationId(item?.store_id);
      setSelectedQuantity(item?.replenishedQuantity);
    }
    setQuantitySelectModal(true);
  }

  const closeQuantityModal = () => {
    setQuantitySelectModal(false);
    setSelectedLocationId("");
    setSelectedQuantity("");
  }

  const onChangeActionMenu = async (selectedMenu) => {
    setSelectedMenu(selectedMenu);
    await getStoreProductList(false,selectedMenu);

    setVisible(false);
  }

  let actionItems;
  if (activeTab == TabName.GENERAL) {
    actionItems = [
      <MenuItem>
        <TouchableOpacity onPress={() => { onHandleLablePrintClick() }}>
          <Text>Print Price Tag</Text>
        </TouchableOpacity>
      </MenuItem>
    ];
  }

  if (activeTab == TabName.LOCATION) {
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


  /* Render flat list funciton end */
  return (
    <Layout
      title="Product Detail"
      showActionMenu={BluetoothManager ? true : false}
      showBackIcon
      closeModal={visible}
      isLoading={isLoading}
      actionItems={actionItems}
    >
      <View style={styles.tabBar}>
        <Tab
          title={TabName.GENERAL}
          isActive={activeTab === TabName.GENERAL}
          onPress={() => setActiveTab(TabName.GENERAL)}
        />
        <Tab
          title={`${TabName.LOCATION} `}
          isActive={activeTab === TabName.LOCATION}
          onPress={() => setActiveTab(TabName.LOCATION)}
        />
      </View>

      {activeTab === TabName.GENERAL && (
        <>
          <SpinnerOverlay
            visible={overlayLoader}
            textContent={"Image Uploading ..."}
            textStyle={{ color: "#fff" }}
            color={Color.PRIMARY}
          />

          <ProductForm
            control={control}
            statusOptions={statusOptions}
            brandList={brandList}
            handleBrand={value => setBrandValue(value)}
            unitData={details.unit ? details.unit : ""}
            StatusData={StatusText(details.status)}
            categoryList={categoryList}
            handleStatus={value => setStatus(value)}
            details={details}
            image={image}
            setImage={setImage}
            setFile={setFile}
            weightUnitOptions={weightUnitOptions}
            categoryData={details.category_id}
            handleCategory={value => setCategoryValue(value)}
            brandData={details.brand_id}
            handleUnit={value => setUnit(value)}
            onPress={handleSubmit(values => UpdateProducts(values))}
          />

          <CountSelectModal
            toggle={toggleModal}
            modalVisible={openCopySelectModal}
            onChange={OnSelectNumberOfCopy}
            ConfirmationAction={onPrintClickHandler}
          />
        </>
      )}

      {activeTab === TabName.LOCATION && (
        <>
          {updatedStoreproductList && updatedStoreproductList.length > 0 ? (

            <View style={{ flex: 1, paddingHorizontal: 10, backgroundColor: Color.ALTERNATIVE_BACKGROUND }}>

              {openQuantitySelectModal && (
                <QuantitySelectModal Numbers={300} modalVisible={openQuantitySelectModal} toggle={closeQuantityModal} value={selectedQuantity} ConfirmationAction={handleReplenish} onChange={quantityOnChange} />
              )}

              <FlatList
                data={updatedStoreproductList}
                renderItem={({ item, index }) => (
                  <ReplenishCard item={item} onEditHandler={quantitySelectModal} quantityOnChange={quantityOnChange} onReplenishHandler={handleReplenish} />
                )}
                keyExtractor={item => item.locationName}
              />
            </View>
          ) : (
            <NoRecordFound iconName={"receipt"} styles={{ paddingVertical: 250, alignItems: "center" }} />
          )}
        </>
      )}
    </Layout>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  input: {
    height: 50,
    marginVertical: 12,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: "white",
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
