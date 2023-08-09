// Import React and Component
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Keyboard } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import SearchBar from "../../components/SearchBar/Search";
import ProductCard from "../../components/ProductCard";
import Layout from "../../components/Layout";
import NoRecordFound from "../../components/NoRecordFound"
import ConfirmationModal from "../../components/Modal/ConfirmationModal";
import BarcodeScanner from "../../components/BarcodeScanner";
import AlertMessage from "../../helper/AlertMessage";
import ProductSelectModal from "../../components/Modal/ProductSelectModal";
import ReplenishService from "../../services/ReplenishService";
import ShowMore from "../../components/ShowMore";
import Refresh from "../../components/Refresh";

const ReplenishmentProducts = (props) => {
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

  const [searchParam, setSearchParam] = useState("")

  //render first time
  useEffect(() => {
    if (isFocused) {
      let mount = true;
      mount && getProductsList();
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
      setPage(2);
      setHasMore("0");
      searchPhrase == "" && setSearch(true);
      searchPhrase == "" && !refreshing && setIsLoading(true);
      ReplenishService.search(null, (err, response) => {
        if (response && response.data && response.data.data) {
          let products = response.data.data;
          setProductList(products);
          setScannedProductList(products);
          setIsLoading(false);
        }
      });

    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  //search results
  const handleChange = async (search) => {
    setSearchParam(search)
    //Api Call
    ReplenishService.search({ search: search ? search : "" }, (error, response) => {
      if (response && response.data && response.data.data) {
        let products = response.data.data;
        setProductList(products);
        if (searchPhrase.length == 0) {
          getProductsList;
        }
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

  //render more list after click the load more button
  const LoadMoreList = async () => {
    try {
      setIsFetching(true);
      ///Api call
      ReplenishService.search({ page: page, search: searchParam ? searchParam : "" }, (error, response) => {
        if (response && response.data && response.data.data) {
          let products = response.data.data
          // Set response in state
          setProductList((prevTitles) => {
            return [...new Set([...prevTitles, ...products])];
          });
          setPage((prevPageNumber) => prevPageNumber + 1);
          setHasMore(products.length > 0);
          setIsFetching(false);
        }
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
    navigation.navigate("ProductReplenish", {
      productId: scannedProduct.id,
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

        ReplenishService.search({ search: barCode ? barCode : "" }, (error, response) => {

          let products = response?.data?.data;
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
      title={"Replenishment Products"}
      isLoading={isLoading}
      bottomToolBar={true}
      refreshing={refreshing}
      showBackIcon={true}
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
                    onPress={() => {
                      navigation.navigate("ProductReplenish", {
                        productId: item.id,
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

export default ReplenishmentProducts;

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
