import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { height } = Dimensions.get("window");

import AsyncStorage from "../../lib/AsyncStorage";

import AsyncStorageConstants from "../../helper/AsyncStorage";

import Permission from "../../helper/Permission";

import { useNavigation, useRoute } from "@react-navigation/native";

import SideMenuCard from "../SideMenuCard";

import { Color } from "../../helper/Color";

import { NativeModules } from "react-native";

import { version } from '../../../package.json';



import { FontAwesome5 } from "@expo/vector-icons";

import BottomToolBar from "./bottomToolBar";
const { BluetoothManager } = NativeModules;

const Menu = (props) => {
  useEffect(() => {
    getPermission();
  }, [])
  const navigation = useNavigation();
  const route = useRoute();
  const routeNameArray = route.name.split('/');
  const menuItemValue = routeNameArray[0];
  const [permissionList, setPermissionList] = useState();
  const Logout = async () => {
    await AsyncStorage.clearAll()
    navigation.navigate("Login");
  };


  const hasPermission = (permissionList, permission) => {
    let isExist = false;
    if (permissionList && permissionList.length > 0) {
      for (let i = 0; i < permissionList.length; i++) {
        if (permissionList[i].role_permission == permission) {
          isExist = true;
        }
      }
    }
    return isExist;
  };

  const getPermission = async () => {
    //get permission list
    let permissionList = await AsyncStorage.getItem(AsyncStorageConstants.PERMISSIONS);
    //validate permission list exist or not
    if (permissionList) {

      //convert string to JSON
      permissionList = JSON.parse(permissionList);
      setPermissionList(permissionList)
    }
  }
  let showSales = hasPermission(permissionList, Permission.SALE_SETTLEMENT_VIEW);
  let showBill = hasPermission(permissionList, Permission.PURCHASE_VIEW);
  let showAttendance = hasPermission(permissionList, Permission.ATTENDANCE_VIEW);
  let showProducts = hasPermission(permissionList, Permission.PRODUCT_VIEW);
  let showOrders = hasPermission(permissionList, Permission.ORDER_VIEW);
  let showTransfer = hasPermission(permissionList, Permission.TRANSFER_VIEW);
  let showStock = hasPermission(permissionList, Permission.STOCK_ENTRY_VIEW);
  let showWishList = hasPermission(permissionList, Permission.WISHLIST_VIEW);
  let showActivity = hasPermission(permissionList, Permission.ACTIVITY_VIEW);
  let showSettings = hasPermission(permissionList, Permission.SETTINGS_VIEW);
  let showTicket = hasPermission(permissionList, Permission.TICKET_VIEW);
  let showFine = hasPermission(permissionList, Permission.FINE_VIEW);
  let storeView = hasPermission(permissionList, Permission.LOCATION_VIEW);

  let candidateProfileView = hasPermission(permissionList, Permission.CANDIDATE_PROFILE_VIEW);
  let showVisitor = hasPermission(permissionList, Permission.VISITOR_VIEW);
  let showReplenish = hasPermission(permissionList, Permission.REPLENISH_VIEW);
  let showOrderReport = hasPermission(permissionList, Permission.ORDER_REPORT_VIEW)
  let showPayment = hasPermission(permissionList, Permission.PAYMENT_VIEW)
  let showSync = hasPermission(permissionList, Permission.SYNC_VIEW)
  let showInspection = hasPermission(permissionList, Permission.INSPECTION_VIEW)
  let showUser = hasPermission(permissionList, Permission.USER_VIEW)
  let showBills = hasPermission(permissionList, Permission.BILL_VIEW)
  let showOrdersales = hasPermission(permissionList, Permission.ORDER_SALES_SETTLEMENT_DISCREPANCY_REPORT_VIEW)





  // Render User Profile
  const _renderUserProfile = () => {
    const { user, updateMenuState } = props;
    return (
      <View
        style={{
          backgroundColor: Color.ACTION_BAR_BACKGROUND,
          alignItems: "center",
          justifyContent: "center",
          height: 55,
          flexDirection: "row",
        }}
      >
        <Text style={styles.name}>Menu</Text>
      </View>
    );
  };

  const syncNavigation = async () => {

    navigation.navigate("Sync", { syncing: true });
  }


  // Render Settings
  const _renderStore = () => {
    const { navigator, setSideMenuOpen } = props;
    return (
      <SideMenuCard
        onPress={() => {
          navigator.navigate("Location")
          setSideMenuOpen(false)
        }}
        name={"Location"}
        Icon="warehouse"
      />
    );
  };
  const _renderOrderSalesSettlementDiscrepancyReport = () => {
    const { navigator, setSideMenuOpen } = props;
    return (
      <SideMenuCard
        onPress={() => {
          navigator.navigate("OrderSalesSettlementDiscrepancyReport")
          setSideMenuOpen(false)
        }}
        name={"Order SalesSelttement Discrepancy Report"}
        Icon="list"
      />
    );
  };

  // Render Stocks
  const _renderStocks = () => {
    const { navigator, setSideMenuOpen } = props;
    return (
      <SideMenuCard
        onPress={() => {
          navigator.navigate("StockEntry")
          setSideMenuOpen(false)
        }}
        name={"Stock"}
        Icon="warehouse"
      />
    );
  };

  const _renderFine = () => {
    const { navigator, setSideMenuOpen } = props;
    return (
      <SideMenuCard
        onPress={() => {
          navigator.navigate("Fine")
          setSideMenuOpen(false)
        }}
        name={"Fines"}
        Icon={"money-bill-alt"}
      />
    );
  };

  const _renderInspection = () => {
    const { navigator, setSideMenuOpen } = props;
    return (
      <SideMenuCard
        onPress={() => {
          navigator.navigate("Inspection")
          setSideMenuOpen(false)
        }}
        name={"Inspection"}
        Icon={"note"}
        MaterialCommunityIcon
      />
    );
  };
  const rendorToolBar = () => {
    const { updateMenuState, setSideMenuOpen, menuOpen } = props;
    return (
      <BottomToolBar
        updateMenuState={updateMenuState}
        setSideMenuOpen={setSideMenuOpen}
        menuOpen={menuOpen}
      />
    );
  };

  const _renderTicket = () => {
    const { navigator, setSideMenuOpen } = props;
    return (
      <SideMenuCard
        onPress={() => {
          navigator.navigate("Ticket")
          setSideMenuOpen(false)
        }}
        name={"Tickets"}
        Icon="ticket-alt"
      />
    );
  };
  const _renderUser = () => {
    const { navigator, setSideMenuOpen } = props;
    return (
      <SideMenuCard
        onPress={() => {
          navigator.navigate("Users")
          setSideMenuOpen(false)
        }}
        name={"Users"}
        Icon="user"
      />
    );
  };
  const _renderVisitor = () => {
    const { navigator, setSideMenuOpen } = props;
    return (
      <SideMenuCard
        onPress={() => {
          navigator.navigate("Visitor")
          setSideMenuOpen(false)
        }}
        name={"Visitors"}
        Icon="user-alt"
      />
    );
  };
  const _renderCandidateProfile = () => {
    const { navigator, setSideMenuOpen } = props;
    return (
      <SideMenuCard
        onPress={() => {
          navigator.navigate("CandidateProfile")
          setSideMenuOpen(false)
        }}
        name={"Candidate Profile"}
        Icon="user-alt"
      />
    );
  };

  // Render Dashboard

  // Render Bill Entry
  const _renderBillEntry = () => {
    const { navigator, setSideMenuOpen } = props;
    return (
      <SideMenuCard
        onPress={() => {
          navigator.navigate("Order")
          setSideMenuOpen(false)
        }}
        name={"Orders"}
        Icon="receipt"
      />
    );
  };

  // Render Logout
  const _renderLogout = () => {
    const { setSideMenuOpen } = props;
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 10,
          paddingHorizontal: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setSideMenuOpen(false)
            Logout();
          }}
          style={{ flexDirection: "row", flex: 1, alignItems: "center" }}
          accessibilityLabel="logout"
        >
          <View style={{ borderRadius: 2, flex: 0.15, padding: 5 }}>
            <FontAwesome5 name="sign-out-alt" size={20} color={Color.PRIMARY} />
          </View>
          <Text style={styles.item} accessibilityLabel="logoutTtile">
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render Logout
  const _renderAttendance = () => {
    const { navigator, setSideMenuOpen } = props;
    return (
      <SideMenuCard
        onPress={() => {
          navigator.navigate("Attendance")
          setSideMenuOpen(false)
        }}
        name={"Attendance"}
        Icon={"user"}
      >


      </SideMenuCard>


    );
  };

  // Render Logout
  const _renderInventoryTransfer = () => {
    const { navigator, setSideMenuOpen } = props;
    return (
      <SideMenuCard
        onPress={() => {
          navigator.navigate("inventoryTransfer")
          setSideMenuOpen(false)
        }}
        name={"Transfer"}
        Icon="truck-moving"
      />
    );
  };

  // render Products
  const _renderProducts = () => {
    const { navigator, setSideMenuOpen } = props;
    return (
      <SideMenuCard
        onPress={() => {
          navigator.navigate("Products")
          setSideMenuOpen(false)
        }}
        name={"Products"}
        Icon="box-open"
      />
    );
  };

  // render Products
  const _renderStoreReplenish = () => {
    const { navigator, setSideMenuOpen } = props;
    return (
      <SideMenuCard
        onPress={() => {
          navigator.navigate("StoreReplenish")
          setSideMenuOpen(false)
        }}
        name={"Store Replenish"}
        Icon="warehouse"
        MaterialCommunityIcon
      />
    );
  };

  // render Products
  const _renderReplenishProducts = () => {
    const { navigator, setSideMenuOpen } = props;
    return (
      <SideMenuCard
        onPress={() => {
          navigator.navigate("ReplenishmentProduct")
          setSideMenuOpen(false)
        }}
        name={"Replenish Products"}
        Icon="transfer"
        MaterialCommunityIcon
      />
    );
  };

  // render Products
  const _renderWishList = () => {
    const { navigator, setSideMenuOpen } = props;
    return (

      <SideMenuCard
        Icon="cart-remove"
        onPress={() => {
          navigator.navigate("WishListProducts")
          setSideMenuOpen(false)
        }}
        name="Wishlist"
        MaterialCommunityIcon
      />
    );
  };

  // render sync
  const _renderSync = () => {
    const { setSideMenuOpen } = props;
    return (

      <SideMenuCard
        Icon="sync"
        onPress={async () => {
          await syncNavigation()
          setSideMenuOpen(false)
        }}
        name="Sync"
        MaterialCommunityIcon
      />
    );
  };

  // render sync
  const _renderSale = () => {
    const { navigator, setSideMenuOpen } = props;
    return (

      <SideMenuCard
        Icon="sale"
        onPress={() => {
          navigator.navigate("SalesSettlement")
          setSideMenuOpen(false)
        }}
        name="Sales Settlement"
        MaterialCommunityIcon
      />
    );
  };



  // Render Build Number
  const _renderBuildNumber = () => {
    return (
      <View
        style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}
      >
        <Text style={{ color: "black", fontSize: 15 }}>{`Version ${version}`}</Text>
      </View>
    );
  };

  const _renderBills = () => {
    const { navigator, setSideMenuOpen } = props;
    return (
      <SideMenuCard
        onPress={() => {
          navigator.navigate("Bills")
          setSideMenuOpen(false)
        }}
        name={"Bills"}
        Icon="money-bill-wave-alt"
      />
    );
  };
  // Render Bill
  const _renderBill = () => {
    const { navigator, setSideMenuOpen } = props;
    return (
      <SideMenuCard
        onPress={() => {
          navigator.navigate("Purchase")
          setSideMenuOpen(false)
        }}
        name={"Purchases"}
        Icon="money-bill-wave-alt"
      />
    );
  };
  const _renderPayments = () => {
    const { navigator, setSideMenuOpen } = props;
    return (
      <SideMenuCard
        onPress={() => {
          navigator.navigate("Payments")
          setSideMenuOpen(false)
        }}
        name={"Payments"}
        Icon="money-bill-alt"
      />
    );
  };
  const _renderActivity = () => {
    const { navigator, setSideMenuOpen } = props;
    return (
      <SideMenuCard
        onPress={() => {
          navigator.navigate("ActivityList")
          setSideMenuOpen(false)
        }}
        name={"Activity"}
        Icon={"chart-bar"}
        MaterialCommunityIcon
      />
    );
  };


  const _renderDivider = () => {
    return (
      <View style={{ backgroundColor: "gray", height: 0.5, marginTop: 10 }} />
    );
  };


  // render sync
  const _renderSettings = () => {
    const { navigator, setSideMenuOpen } = props;
    return (
      <SideMenuCard
        Icon="cog-outline"
        onPress={() => {
          navigator.navigate("Settings")
          setSideMenuOpen(false)
        }}
        name="Settings"
        MaterialCommunityIcon
      />
    );
  };


  // Render Order Report
  const _renderOrderReports = () => {
    const { navigator, setSideMenuOpen } = props;
    return (
      <SideMenuCard
        onPress={() => {
          navigator.navigate("Reports")
          setSideMenuOpen(false)
        }}
        name={"Order Report"}
        Icon="list"
      />
    );
  };


  return (
    <View style={{ flex: 1, backgroundColor: Color.NAVIGATION_BAR_BACKGROUND }}>
      {_renderUserProfile()}
      <View style={{ backgroundColor: "gray", height: 0.5 }} />
      <View style={{ flex: 0.9 }}>
        <ScrollView style={{ height: "100%" }}>
          {showActivity && _renderActivity && _renderActivity()}
          {showAttendance && _renderAttendance && _renderAttendance()}
          {showBills && _renderBills &&_renderBills()}
          {candidateProfileView && _renderCandidateProfile()}
          {showFine && _renderFine && _renderFine()}
          {showInspection && _renderInspection && _renderInspection()}
          {showOrders && _renderBillEntry && _renderBillEntry()}
          {showOrdersales && _renderOrderSalesSettlementDiscrepancyReport && _renderOrderSalesSettlementDiscrepancyReport()}
          {showProducts && _renderProducts && _renderProducts()}
          {showBill && _renderBill && _renderBill()}
          {showPayment && _renderPayments() && _renderPayments()}
          {showReplenish && _renderReplenishProducts && _renderReplenishProducts()}
          {showOrderReport && _renderOrderReports && _renderOrderReports()}
          {showReplenish && _renderStoreReplenish && _renderStoreReplenish()}
          {showSales && _renderSale && _renderSale()}
          {showSettings && _renderSettings && _renderSettings()}
          {showStock && _renderStocks && _renderStocks()}
          {showSync && _renderSync() && _renderSync()}
          {storeView && _renderStore()}
          {showTicket && _renderTicket()}
          {showTransfer && _renderInventoryTransfer && _renderInventoryTransfer()}
          {showUser && _renderUser && _renderUser()}
          {showVisitor && _renderVisitor()}
          {showWishList && _renderWishList()}
          {_renderDivider()}
          {_renderLogout()}
          {_renderDivider()}
        </ScrollView>
      </View>
      {_renderBuildNumber()}
      {rendorToolBar()}
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({
  container: {
    height,
    backgroundColor: "#ededed",
  },
  name: {
    color: "black",
    textAlign: "left",
    fontSize: 20,
    fontWeight: "500",
    padding: 10,
  },
  item: {
    fontSize: 16,
    fontWeight: "400",
    color: Color.TITLE,
    textAlign: "center",
    padding: 10,
  },
  icon: {
    height: 15,
    width: 15,
    tintColor: Color.TITLE,
  },
  eventIcon: {
    height: 30,
    width: 30,
  },
  thumbnail: {
    width: 100,
    height: 100,
  },
  closeButton: {
    position: 'absolute',
    top: 17,
    right: 10,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});