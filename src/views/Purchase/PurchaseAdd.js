import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AccountService from "../../services/AccountService";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import purchaseService from "../../services/PurchaseService";
import { MaterialIcons } from "@expo/vector-icons";
import AlternativeColor from "../../components/AlternativeBackground";
import SearchBar from "../../components/SearchBar";
import Spinner from "../../components/Spinner";
import AsyncStorageService from "../../services/AsyncStorageService";

const PurchaseAdd = () => {
  const [vendorList, setVendorList] = useState();
  const [store, setStore] = useState();
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);
  const [search, setSearch] = useState(false);

  const isFocused = useIsFocused();

  const navigation = useNavigation();

  useEffect(() => {

    let mount = true;

    mount && getVendorList()

    //cleanup function
    return () => {
      mount = false;
    };

  }, [isFocused])

  const getVendorList = () => {
    AccountService.GetList(null, (callback) => { setVendorList(callback) })
  }


  useEffect(() => {
    getStore();
  }, [])

  const getStore = async () => {
    let storeId = await AsyncStorageService.getSelectedLocationId();
    setStore(storeId)

  }

  const createPurchase = (storeId, params) => {
    if (storeId) {
      const createData = {
        date: new Date(),
        vendor_name: params.label,
        location: storeId
      };
      purchaseService.createPurchase(createData, (err, res) => {
        let purchaseNumber = res?.data?.purchase?.purchase_number
        let location = res?.data?.purchase?.store_id
        let id = res?.data?.purchase?.id;
        navigation.navigate("PurchaseForm", { vendor_id: params.value, location: location, id: id, purchaseNumber: purchaseNumber, isNewPurchase: true })

      })
    }
  }

  const onStoreSelect = (selectedStore, params) => {
    if (selectedStore) {
      createPurchase(selectedStore.id, params);
    }
  }

  const AddPurchase = (values) => {
    if (!store) {
      navigation.navigate("StoreSelector", { onSelectStore: onStoreSelect, params: values })
    } else {
      createPurchase(store, values);
    }
  }



  const handleChange = async (search) => {
    const params = {
      search: search
    }
    AccountService.GetList(params, response => {
      setVendorList(response);
    });

  }


  return (
    <Layout
      title={'Select Vendor'}
      showBackIcon>

      <ScrollView
        keyboardShouldPersistTaps="handled"
      >

        <SearchBar
          searchPhrase={searchPhrase}
          setSearchPhrase={setSearchPhrase}
          setClicked={setClicked}
          clicked={clicked}
          setSearch={setSearch}
          onPress={getVendorList}
          handleChange={handleChange}
          noScanner
        />
        {(
          vendorList && vendorList.length > 0 &&
          vendorList.map((item, index) => {
            const containerStyle = AlternativeColor.getBackgroundColor(index)


            return (
              <TouchableOpacity onPress={(e) => {
                AddPurchase(item)
              }
              } style={[{
                height: 60,
                backgroundColor: "#fff",
                borderColor: "#fff",
                borderBottomWidth: 1,
                borderBottomColor: "lightgrey"
              }, containerStyle]} >
                <View style={{ flexDirection: "row", justifyContent: "flex-start", flex: 2, alignItems: "center" }}>
                  <Text style={{ fontSize: 16, flex: 0.9, marginTop: 5 }}>{item.label}</Text>
                  <View style={{ flex: 0.1, alignItems: "flex-end" }}>

                    <MaterialIcons name="chevron-right" size={30} color="gray" />
                  </View>
                </View>
              </TouchableOpacity>
            )
          })
        )}
      </ScrollView>
    </Layout>


  )

}
export default PurchaseAdd;