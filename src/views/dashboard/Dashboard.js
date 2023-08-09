// Import React and Component
import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Layout from "../../components/Layout";
import Refresh from "../../components/Refresh";
import { Color } from "../../helper/Color";
import Permission from "../../helper/Permission";
import DateTime from "../../lib/DateTime";
import AsyncStorageService from "../../services/AsyncStorageService";
import AttendanceService from "../../services/AttendanceService";
import inventoryTransferService from "../../services/InventoryTransferService";
import PermissionService from "../../services/PermissionService";
import TransferTypeService from "../../services/TransferTypeService";
import AttendanceCard from "./AttendanceCard";
import HeaderCard from "./HeaderCard";
import OrderCard from "./OrderCard";
import QuickLinks from "./QuickLinks";
import SyncCard from "./SyncCard";
import TicketList from "./TicketList";
import dashboardService from "../../services/DashboardService";
import VerticalSpace10 from "../../components/VerticleSpace10";
import SyncService from "../../services/SyncService";
import FineList from "./FineList";




const Dashboard = (props) => {

  const param = props.route.params

  const [refreshing, setRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [locationName, setLocationName] = useState();
  const [userName, setUserName] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [ids, setIds] = useState([]);
  const [attendanceCheckinCheckPermission, setAttendanceCheckinCheckPermission] = useState("")
  const navigator = useNavigation();
  const focused = useIsFocused();
  const [transferTypeList, setTransferTypeList] = useState([]);
  const navigation = useNavigation();
  const [workingDay, setWorkingDay] = useState([]);
  const [leave, setLeave] = useState([]);
  const [additionalDay, setAdditionalDay] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [ticketViewPermission, setTicketViewPermission] = useState()
  const [orderViewPermission, setOrderViewPermission] = useState()
  const [fineViewPermission, setFineViewPermission] = useState()
  const [syncViewPermission, setSyncViewPermission] = useState()
  const [transferViewPermission, setTransferViewPermission] = useState()
  const [permission, setPermission] = useState([])


  useEffect(() => {
    getAsyncStorageItem();
    getTransferTypeByRole();
    getPermission();
    getAttendanceDetail();
  }, [focused, isLoading])

  useEffect(() => {

    const loginSync = async () => {
      if (param?.login) {
        await SyncService.Sync(() => { });

      }
    };
    loginSync()

  }, [param?.login])



  const getTransferTypeByRole = () => {
    TransferTypeService.searchByRole(null, (error, response) => {
      if (response && response.data && response.data.data) {
        setTransferTypeList(response.data.data)
      }
    })
  }

  const getPermission = async () => {
    const isExist = await PermissionService.hasPermission(Permission.USER_MOBILE_CHECKIN);
    setAttendanceCheckinCheckPermission(isExist)
    const ticketViewPermission = await PermissionService.hasPermission(Permission.TICKET_VIEW);
    setTicketViewPermission(ticketViewPermission)
    const orderViewPermission = await PermissionService.hasPermission(Permission.ORDER_VIEW);
    setOrderViewPermission(orderViewPermission)
    const fineViewPermission = await PermissionService.hasPermission(Permission.FINE_VIEW);
    setFineViewPermission(fineViewPermission)
    const syncViewPermission = await PermissionService.hasPermission(Permission.SYNC_VIEW);
    setSyncViewPermission(syncViewPermission)
    const transferViewPermission = await PermissionService.hasPermission(Permission.TRANSFER_VIEW);
    setTransferViewPermission(transferViewPermission)
    let permission = new Array()
    if (orderViewPermission) {
      permission.push(orderViewPermission)
    }
    if (transferViewPermission) {
      permission.push(transferViewPermission)
    }
    if (syncViewPermission) {
      permission.push(syncViewPermission)
    }
    if (isExist) {
      permission.push(isExist)
    }
    setPermission(permission);
  }




  const getAsyncStorageItem = async () => {
    let storeId = await AsyncStorageService.getSelectedLocationId()
    setIds(storeId)
    let locationName = await AsyncStorageService.getSelectedLocationName()
    setLocationName(locationName)
    let userName = await AsyncStorageService.getUserName()
    setUserName(userName)
    let userId = await AsyncStorageService.getUserId();
    setSelectedUser(userId)

  }

  const onSelectStore = (selectedStore) => {
    if (selectedStore) {
      navigation.navigate("Order/ProductList", { storeId: selectedStore.id, locationName: selectedStore.name, salesExecutive: userName, userId: selectedUser, isNewOrder: true });
    }
  }

  const AddNew = () => {
    if (!ids) {
      navigation.navigate("StoreSelector", {
        onSelectStore: onSelectStore
      });
    } else {
      navigation.navigate("Order/ProductList", { storeId: ids, locationName: locationName, salesExecutive: userName, userId: selectedUser, isNewOrder: true });
    }
  };

  const CheckIn = async () => {
    navigation.navigate("shiftSelect", {
      showAllowedShift: true,
      redirectionUrl: "Dashboard",
      navigation: navigation
    })
  };

  const syncNavigation = async () => {

    navigator.navigate("Sync", { syncing: true });
  };

  const checkOutValidation = async (id) => {
    await AttendanceService.CheckOutValidation(id, async (err, response) => {
      if (response) {
        setIsLoading(true);
        AttendanceService.checkOut(id, () => {
          setIsLoading(false);
        })
      }

    })
  }
  const getAttendanceDetail = async () => {
    await dashboardService.get((err, response) => {
      if (response && response.data) {
        setAdditionalDay(response.data.additionalDay)
        setWorkingDay(response.data.workedDay)
        setLeave(response.data.Leave)
        setTodayAttendance(response.data.todayAttendance);
      }
    })
  };

  const addNewTransfer = () => {
    inventoryTransferService.onTransferTypeClickStoreSelect(transferTypeList, navigation);
  }

  return (
    <Layout
      zunomart
      hideFooterPadding={true}
      bottomToolBar={true}
      showMessage
      isLoading={isLoading}
      refreshing={refreshing}
    >
      <View style={{ flex: 1, backgroundColor: Color.WHITE }}>

        <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>
        <VerticalSpace10/>

          {/* Header Section */}
          <HeaderCard locationName={locationName} name={userName} />

          {/* QuickLinks Section  */}
          {permission && permission.length > 0 && (
            <QuickLinks AddNewOrder={AddNew} CheckIn={CheckIn} addNewTransfer={addNewTransfer} syncNavigation={syncNavigation} />
          )}
          {/* Sync Section */}
          {syncViewPermission && (
            <SyncCard />
          )}
        <VerticalSpace10 />

          {/* Attendance Section */}
          {attendanceCheckinCheckPermission && (
            <AttendanceCard checkOut={checkOutValidation} CheckIn={CheckIn} workingDay={workingDay} leave={leave} additionalDay={additionalDay} checkIn={todayAttendance} navigation={navigation} />)}
        <VerticalSpace10/>

          {/* Fine Section */}
          {fineViewPermission && (
            <FineList />
          )}

          {/* Order Section */}
          {orderViewPermission && (
            <OrderCard />
          )}
          {/* {Ticket Section} */}
          {ticketViewPermission && (
            <TicketList />
          )}
          <VerticalSpace10/>

        </Refresh>
      </View>

    </Layout>
  );
};
export default Dashboard;
