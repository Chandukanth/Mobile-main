// Import React and Component
import React, { useState, useEffect, useRef, useCallback } from "react";
import { StyleSheet, View, RefreshControl, Keyboard, ScrollView } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import SearchBar from "../../components/SearchBar/Search";
import ProductCard from "../../components/ProductCard";
import Layout from "../../components/Layout";
import NoRecordFound from "../../components/NoRecordFound"
import ConfirmationModal from "../../components/Modal/ConfirmationModal";
import BarcodeScanner from "../../components/BarcodeScanner";
import AlertMessage from "../../helper/AlertMessage";
import ProductSelectModal from "../../components/Modal/ProductSelectModal";
import Permission from "../../helper/Permission";
import AsyncStorageService from "../../services/AsyncStorageService";
import productService from "../../services/ProductService";
import ShowMore from "../../components/ShowMore";
import Refresh from "../../components/Refresh";
import PermissionService from "../../services/PermissionService";



const Products = (props) => {
  //state
  const [productList, setProductList] = useState("");
  //Loading
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  //search
  const [searchPhrase, setSearchPhrase] = useState("");
  const [search, setSearch] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  //setting tha initial page
  const [page, setPage] = useState(2);
  //we need to know if there is more data
  const [HasMore, setHasMore] = useState(true);

  const isFocused = useIsFocused();

  const [modalVisible, setScanModalVisible] = useState(false);

  const [onScanValidation, setOnScanValidation] = useState(false);

  const [scannedCode, setScannedCode] = useState("");

  const [scannedProductList, setScannedProductList] = useState("");

  const [productNotFoundModalOpen, setProductNotFoundModalOpen] = useState(false);

  const [productSelectModalOpen, setProductSelectModalOpen] = useState(false);

  const [manageOther, setManageOther] = useState(false);

  const [searchParam, setSearchParam] = useState("")

  const [editPermission,setEditPermission] = useState("")

  //render first time
  useEffect(() => {
    if (isFocused) {
      let mount = true;
      mount && getProductsList();
      mount && getPermission();
      mount && getProductsList();
      mount && EditPermission();
      return () => {
        mount = false;
      };
    }
  }, [isFocused, refreshing]);

  const navigation = useNavigation();

  //Get Product List
  const getProductsList = async () => {
    try {
      setSearchPhrase("");
      setClicked(false);
      handleScannedData("");
      Keyboard.dismiss();
      setPage(2);
      setHasMore("0");
      searchPhrase == "" && setSearch(true);
      searchPhrase == "" && !refreshing && setIsLoading(true);
      productService.search(null, null, (error, response) => {
        let products = response;
        setProductList(products);
        setScannedProductList(products);
        setIsLoading(false);
      })


    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const EditPermission = async () => {
    const editPermission = await PermissionService.hasPermission(Permission.PRODUCT_EDIT);
    setEditPermission(editPermission);
}

  const AddNew = () => {
    navigation.navigate("Products/Add");
  };

  //when the loading starts spinner will start

  //search results
  const handleChange = async (search) => {
    setSearchParam(search)
    //Api Call
    productService.search(null, { search: search ? search : "" }, (error, response) => {
      let products = response;
      setProductList(products);
      if (searchPhrase.length == 0) {
        getProductsList;
      }
    })

  };



  const toggle = () => {
    setScanModalVisible(!modalVisible);
    setOnScanValidation(false);
  }

  const productNotFoundToggle = () => {
    setProductNotFoundModalOpen(!productNotFoundModalOpen);
  }

  const getPermission = async () => {
    let permissionList = await AsyncStorageService.getPermissions();
    if (permissionList) {
      permissionList = JSON.parse(permissionList);
      if (permissionList && permissionList.length > 0) {
        let manageOther = permissionList &&
          permissionList.find((option) => option.role_permission === Permission.PRODUCT_ADD)
          ? true
          : false;
        setManageOther(manageOther)
      }
    }
  }


  //render more list after click the load more button
  const LoadMoreList = async () => {
    try {
      setIsFetching(true);

      ///Api call
      productService.search(null, { page: page, search: searchParam ? searchParam : "" }, (error, response) => {
        let products = response
        // Set response in state
        setProductList((prevTitles) => {
          return [...new Set([...prevTitles, ...products])];
        });
        setPage((prevPageNumber) => prevPageNumber + 1);
        setHasMore(products.length > 0);
        setIsFetching(false);
      })

    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const productSelectModalToggle = () => {
    setProductSelectModalOpen(!productSelectModalOpen);
  }

  const onScanAction = async (scannedProduct) => {
    editPermission &&  navigation.navigate("Products/Details", {
      productId: scannedProduct.id,
      name: scannedProduct.name,
      product_name: scannedProduct.product_display_name,
      quantity: scannedProduct.quantity,
      brand: scannedProduct.brand_name,
      status: scannedProduct.status,
      brand_id: scannedProduct.brand_id,
      image: scannedProduct.image,
      category_id: scannedProduct.category_id,
      category: scannedProduct.category_name,
      size: scannedProduct.size,
      unit: scannedProduct.unit,
      mrp: scannedProduct.mrp,
      sale_price: scannedProduct.sale_price,
      barcode: scannedProduct.barcode,
      printName: scannedProduct.print_name
    });

  }


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

        productService.search(null, { search: barCode ? barCode : "" }, (error, response) => {
          let products = response;
          //validate store product exist or not
          if (products && products.length > 0 && products.length == 1) {

            //get scanned product
            let scannedProduct = products[0];

            onScanAction(scannedProduct);


          } else if (products && products.length > 1) {

            //set store product list
            setScannedProductList(products);

            setProductSelectModalOpen(true);

          } else {
            //set onscan validation
            setOnScanValidation(false);

            productNotFoundToggle();
          }

        })
        setOnScanValidation(false)
      }
    } catch (err) {
      //set onscan validation
      setOnScanValidation(false);
    }
  };

  return (
    <Layout
      title={"Products"}
      buttonLabel={manageOther ? "New" : ""}
      buttonOnPress={AddNew}
      isLoading={isLoading}
      bottomToolBar={true}
      refreshing={refreshing}
    >
      <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>
        <View style={styles.searchBar}>
          <SearchBar
            searchPhrase={searchPhrase}
            setSearchPhrase={setSearchPhrase}
            setClicked={setClicked}
            clicked={clicked}
            setSearch={setSearch}
            onPress={getProductsList}
            handleChange={handleChange}
            openScanner={toggle}
          />

          <BarcodeScanner
            toggle={toggle}
            modalVisible={modalVisible}
            handleScannedData={handleScannedData}
            handleChange={handleChange}
          />

          {productSelectModalOpen && (
            <ProductSelectModal
              modalVisible={productSelectModalOpen}
              toggle={productSelectModalToggle}
              items={scannedProductList}
              updateAction={onScanAction}
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
        </View>
        <View style={styles.container}>
          <View>
            {productList && productList.length > 0 ? (
              productList.map((item) => {
                return (
                  <ProductCard
                  
                    onPress={() => {  editPermission && 
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
                );
              })
            ) : (
              <NoRecordFound styles={{ paddingVertical: 250, alignItems: "center" }} iconName="box-open" />
            )}
          </View>
        </View>
        <ShowMore List={productList} isFetching={isFetching} HasMore={HasMore} onPress={LoadMoreList} />
      </Refresh>
    </Layout>
  );
};

export default Products;

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
  headerStyle: {
    display: "flex",
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-between",
    backgroundColor: "#E8E8E8",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addStocks: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  addButton: {
    height: 10,
  },
  card: {
    height: 60,
    alignItems: "center",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 5,
  },
  cartText: {
    fontSize: 16,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
