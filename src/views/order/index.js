// Import React and Component
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Keyboard,
  ScrollView
} from "react-native";
import { useLinkProps, useNavigation } from "@react-navigation/native";
import SearchBar from "../../components/SearchBar";
import { Color } from "../../helper/Color";
// icons
import { MaterialIcons } from "@expo/vector-icons";
import { endpoints } from "../../helper/ApiEndPoint";
import AsyncStorage from "../../lib/AsyncStorage";
import AsyncStorageConstants from "../../helper/AsyncStorage";
// Spinner
import Spinner from "../../components/Spinner";
import OrderCard from "./components/OrderCard";
import Layout from "../../components/Layout";
import { useIsFocused } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import ActionButton from "../../components/ActionBarButton";

import OrderService from "../../services/OrderService";
import { SwipeListView } from "react-native-swipe-list-view";

import Select from "../../components/Select";

import Permission from "../../helper/Permission";

import DeleteConfirmationModal from "../../components/Modal/DeleteConfirmationModal";
import ProductService from "../../services/ProductService";
import shiftService from "../../services/ShiftService";
import dateTime from "../../lib/DateTime";
import LoadMoreButton from "../../components/LoadMoreButton";
import TabName from '../../helper/Tab';
import Tab from "../../components/Tab";
import FooterContent from "./components/OrderListFooterContent";
import Currency from "../../lib/Currency";
import Order from "../../helper/Order";
import { PaymentType } from "../../helper/PaymentType";
import settingService from "../../services/SettingService";
import { MenuItem } from "react-native-material-menu";
import { useForm } from "react-hook-form";
import options from "../../helper/Filter";
import ShowMore from "../../components/ShowMore";
import NoRecordFound from "../../components/NoRecordFound";
import Refresh from "../../components/Refresh";
import DateFilter from "../../components/DateFilter";
import DropDownMenu from "../../components/DropDownMenu";



const Products = (props) => {
  const [orderList, setOrderList] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [search, setSearch] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedShift, setSelectedShft] = useState("");
  const [createdByUser, setSelectedByUser] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [activeTab, setActiveTab] = useState(TabName.TODAY);
  const [locationName, setlocationName] = useState();
  const [userName, setUserName] = useState();
  const [shiftName, setShiftName] = useState();
  //setting tha initial page
  const [page, setPage] = useState(2);
  //we need to know if there is more data
  const [HasMore, setHasMore] = useState(true);
  const [OrderDeleteModalOpen, setOrderDeleteModalOpen] = useState(false);
  const [allOrder, setAllOrder] = useState("")
  const [selectedItem, setSelectedItem] = useState("");

  const [selectedRowMap, setSelectedRowMap] = useState("");

  const [manageOther, setManageOther] = useState(false);

  const [orderTotal, setOrderTotal] = useState(false);

  const [ids, setIds] = useState([]);

  const [todayList, setTodayList] = useState('');

  const [totalAmount, setTotalAmount] = useState(0);
  const [totalCashAmount, setTotalCashAmount] = useState(0);
  const [totalPaytmAmount, setTotalPaytmAmount] = useState(0);
  const [visible, setVisible] = useState(false)
  const [selectedOption, setSelectedOption] = useState(options[0].value);
  const [searchParam, setSearchParam] = useState("")


  const stateRef = useRef();
  const isFocused = useIsFocused();

  const navigation = useNavigation();

  // Pull down to refresh the page
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  // render the stock entry list function
  useEffect(() => {
    if (isFocused) {
      let mount = true;
      mount && getAllList();

      //cleanup function
      return () => {
        mount = false;
      };
    }
  }, [isFocused, navigation]);

  useEffect(() => {
    getAllList();

  }, [refreshing, navigation, isFocused]);
  useEffect(() => {
    let mount = true;

    //get permission
    mount && getPermission();
    return () => {
      mount = false;
    }
  }, [isFocused])
  useEffect(() => {
    let mount = true;
    mount && getTotalPermission();
    return () => {
      mount = false;
    }

  }, [isFocused])

  useEffect(() => {
    saveStore();
  }, [isFocused])

  useEffect(() => {
    getRequiredValues();
  }, [isFocused]);

  const getPermission = async () => {
    //get permission list
    let permissionList = await AsyncStorage.getItem(AsyncStorageConstants.PERMISSIONS);
    //validate permission list exist or not
    if (permissionList) {

      //convert string to JSON
      permissionList = JSON.parse(permissionList);
      //validate permission list exist or not
      if (permissionList && permissionList.length > 0) {
        //get permission
        let manageOther = permissionList &&
          permissionList.find((option) => option.role_permission === Permission.ORDER_DELETE)
          ? true
          : false;
        //set all user
        setManageOther(manageOther)
      }
    }
  }
  const getTotalPermission = async () => {
    let permissionList = await AsyncStorage.getItem(AsyncStorageConstants.PERMISSIONS);
    if (permissionList) {

      //convert string to JSON
      permissionList = JSON.parse(permissionList);
      //validate permission list exist or not
      if (permissionList && permissionList.length > 0) {
        let manageTotalView = permissionList &&
          permissionList.find((option) => option.role_permission === Permission.ORDER_TOTAL_VIEW)
          ? true
          : false;
        setOrderTotal(manageTotalView)


      }
    }
  }

  const getRequiredValues = async () => {

    //get shift list
    shiftService.getShiftList(null, (error, response) => {

      //validate shift list exist or nott
      let shiftList = response?.data?.data;

      //validate shift list
      if (shiftList && shiftList.length > 0) {
        //loop the shift list
        for (let i = 0; i < shiftList.length; i++) {

          let timeValidation = dateTime.compareTime(shiftList[i].start_time, shiftList[i].end_time);

          if (timeValidation) {
            setSelectedShft(shiftList[i].id);
            setShiftName(shiftList[i].name)
          }

        }
      }
    })

    //get permission list
    let userId = await AsyncStorage.getItem(AsyncStorageConstants.USER_ID);

    setSelectedUser(userId)
    setSelectedByUser(userId)
  };

  const getAllList = async () => {
    try {
      setSearchPhrase("");
      setClicked(false);
      Keyboard.dismiss();
      setPage(2);
      setHasMore("0");
      searchPhrase == "" && setSearch(false);
      searchPhrase == "" && !refreshing && setIsLoading(true);
      let param = { sort: "createdAt", sortDir: "DESC",startDate: dateTime.formatDate(new Date()), endDate: dateTime.toISOEndTimeAndDate(new Date())};

      OrderService.searchOrder(param, (error, response) => {
        let orders = response && response?.data && response?.data?.data
        let totalAmount = response && response?.data && response?.data?.totalAmount;
        let totalUpiAmount = response && response?.data && response?.data?.totalUpiAmount;
        let totalCashAmount = response && response?.data && response?.data?.totalCashAmount;
        setTodayList(orders);
        setIsLoading(false);
        setAllOrder(orders);
        setTotalAmount(totalAmount);
        setTotalCashAmount(totalCashAmount);
        setTotalPaytmAmount(totalUpiAmount);
        setVisible(false)

      })

      let params = { page: 1, sort: "createdAt", sortDir: "DESC",startDate: dateTime.formatDate(new Date()), endDate: dateTime.toISOEndTimeAndDate(new Date()) };

      OrderService.searchOrder(params, (error, response) => {
        let orders = response && response?.data && response?.data?.data;

        // Set response in state
        setTodayList(orders);
        setIsLoading(false);
        setAllOrder(orders)


      })
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };


      

  const onSelectStore = (selectedStore) => {
    if (selectedStore) {
      navigation.navigate("Order/ProductList", { storeId: selectedStore.id, locationName: selectedStore.name, shift: shiftName, salesExecutive: userName, userId: selectedUser, shiftId: selectedShift, isNewOrder: true });
    }
  }


  const AddNew = () => {
    if (!ids) {
      navigation.navigate("StoreSelector", {
        onSelectStore: onSelectStore
      });
    } else {
      navigation.navigate("Order/ProductList", { storeId: ids, locationName: locationName, shift: shiftName, salesExecutive: userName, userId: selectedUser, shiftId: selectedShift, isNewOrder: true });
    }
  };

  const saveStore = async () => {

    try {
      await AsyncStorage.getItem(AsyncStorageConstants.SELECTED_LOCATION_ID).then((res) => setIds(res))
      await AsyncStorage.getItem(AsyncStorageConstants.SELECTED_LOCATION_NAME).then((res) => setlocationName(res))
      await AsyncStorage.getItem(AsyncStorageConstants.USER_NAME).then((res) => setUserName(res))
    }

    catch (error) {
      console.log(error);

    }

  }

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  }

  const clearRowDetail = () => {
    if (stateRef) {
      const selectedItem = stateRef.selectedItem;
      const selectedRowMap = stateRef.selecredRowMap;
      if (selectedItem && selectedRowMap) {
        closeRow(selectedRowMap, selectedItem.id)
        setSelectedItem("");
        setSelectedRowMap("");
        stateRef.selectedItem = "";
        stateRef.selecredRowMap = "";
      }
    }
  }

  const orderDeleteModalToggle = () => {
    setOrderDeleteModalOpen(!OrderDeleteModalOpen);
    clearRowDetail();
  }

  const renderHiddenItem = (data, rowMap) => {
    return (
      <>
        <View style={styles.more}>
          <DropDownMenu label="More" color={Color.WHITE} icon="ellipsis-horizontal" MenuItems={[<MenuItem onPress={() => {
            setVisible(true),
              orderDeleteModalToggle()
            setSelectedItem(data?.item);
            setSelectedRowMap(rowMap);
            stateRef.selectedItem = data?.item;
            stateRef.selecredRowMap = rowMap;
            closeRow(rowMap, data?.item.id);
          }}>
            DELETE
          </MenuItem>]} onPress={visible} />
        </View>
        <View style={styles.swipeStyle}>
          <TouchableOpacity
            style={styles.actionDeleteButton}
            onPress={() => {
              navigation.navigate("Order/Invoice", { item: data.item })

            }}
          >
            <Text style={styles.btnText}>View Invoice</Text>
          </TouchableOpacity>
        </View>

      </>

    )
  };

  const renderItem = ({ item, index }) => {

    return (
     
      <View style={styles.container}>
        <OrderCard
          order_number={item.order_number}
          date={item.date}
          locationName={item.locationName}
          status={item.status}
          statusColor={item?.statusDetail?.color_code}
          payment_type={item.payment_type}
          total_amount={item.total_amount}
          shift={item.shift}
          index={index}
          onPress={() => {
            navigation.navigate("Order/ProductList", { id: item.id, storeId: item.store_id, locationName: item?.locationName, shift: item?.shift, shiftId: item?.shiftDetail?.id, salesExecutive: item?.salesExecutive, sales_executive_user_id: item?.sales_executive_user_id, date: item?.date, status: item.status, status_id: item?.statusDetail?.id, allow_edit: item?.statusDetail?.allow_edit, orderNumber: item.order_number });
          }}
        />
      </View>

    );
  };



  const TodayLoadMoreList = async () => {
    try {
      setIsFetching(true);

      let params

        params = { page: page,search: searchParam ? searchParam : "" , sort: "createdAt", sortDir: "DESC",startDate: dateTime.formatDate(new Date()), endDate: dateTime.toISOEndTimeAndDate(new Date()) };
      OrderService.searchOrder(params, (error, response) => {

        let orders = response?.data?.data;

        // Set response in state
        setTodayList((prevTitles) => {
          return [...new Set([...prevTitles, ...orders])];
        });
        setPage((prevPageNumber) => prevPageNumber + 1);
        setHasMore(orders.length > 0);
        setIsFetching(false);
      });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const {
    control,
    formState: { errors },
  } = useForm();

  const OrderDelete = async () => {
    if (selectedItem) {
      OrderService.DeleteOrder(selectedItem.id, (error, response) => {
        getAllList();
      })
    }
  };
  const handleChange = async (search) => {
    setSearchParam(search)
    //Api Call
    OrderService.searchOrder({ search: search ? search : "" ,startDate: dateTime.formatDate(new Date()), endDate: dateTime.toISOEndTimeAndDate(new Date())}, (error, response) => {
      let list = response.data.data;
      setTodayList(list);
      if (searchPhrase.length == 0) {
        getAllList;
      }
    })

  };


  return (
    <Layout
      title={"Orders"}
      buttonLabel={"New"}
      buttonOnPress={AddNew}
      isLoading={isLoading}
      refreshing={refreshing}
      bottomToolBar={true}
      FooterContent={orderTotal && todayList && todayList.length > 0 && <FooterContent
        Cash={totalCashAmount}
        Paytm={totalPaytmAmount}
        totalAmount={totalAmount}

      />
       }
       
       
    >
     
      
      <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>
        <DeleteConfirmationModal
          modalVisible={OrderDeleteModalOpen}
          toggle={orderDeleteModalToggle}
          item={selectedItem}
          updateAction={OrderDelete}
        />

        <View style={styles.container}>
        <View style={styles.searchBar}>
                    <SearchBar
                       searchPhrase={searchPhrase}
                       setSearchPhrase={setSearchPhrase}
                       setClicked={setClicked}
                       clicked={clicked}
                       setSearch={setSearch}
                       onPress={getAllList}
                       handleChange={handleChange}
                       noScanner
          />

          </View>
          <View>
            {todayList && todayList.length > 0 ?
              <>
               
                <SwipeListView
                  data={todayList}
                  renderItem={renderItem}
                  renderHiddenItem={renderHiddenItem}
                  rightOpenValue={-140}
                  previewOpenValue={-40}
                  previewOpenDelay={3000}
                  disableRightSwipe={true}
                  disableLeftSwipe={manageOther ? false : true}
                  closeOnRowOpen={true}
                  keyExtractor={item => String(item.id)}
                />
              </>
              : (
                <NoRecordFound iconName="receipt" />
              )}

            <ShowMore List={todayList} isFetching={isFetching} HasMore={HasMore} onPress={TodayLoadMoreList} />
          </View>
        </View>
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
  swipeStyle: {
    flex: 1,

  },
  more: {
    alignItems: 'center',
    bottom: 10,
    justifyContent: 'center',
    position: 'absolute',
    top: 10,
    width: 70,
    backgroundColor: Color.SECONDARY,
    right: 70
  },
  actionDeleteButton: {
    alignItems: 'center',
    bottom: 10,
    justifyContent: 'center',
    position: 'absolute',
    top: 10,
    width: 70,
    backgroundColor: Color.GREY,
    right: 0
  },
  btnText: {
    color: Color.WHITE,
  },

});
