// Import React and Component
import React, { useState, useEffect } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesome5 } from "@expo/vector-icons";
import { Color } from "../../helper/Color";
import { useNavigation, useRoute } from "@react-navigation/native";
import IconValue from "../../helper/navBarItems";
import AsyncStorage from "../../lib/AsyncStorage";
import AsyncStorageConstants from "../../helper/AsyncStorage";
import Permission from "../../helper/Permission";
import MenuName from "../../helper/navBarItems";
import ToolBarItem from "../ToolBarItem";



const BottomToolBar = ({ updateMenuState, setSideMenuOpen, menuOpen }) => {
    const [permissionList, setPermissionList] = useState();
    const [menuActive, setMenuActive] = useState(false);
    const navigation = useNavigation();
    const route = useRoute();
    const routeNameArray = route.name.split('/');
    const menuItemValue = menuOpen ? IconValue.MENU : routeNameArray[0];

    useEffect(() => {
        getPermission();
    }, []);

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

    let replenishView = hasPermission(permissionList, Permission.MOBILEAPP_DASHBOARD_MENU_REPLENISH);
    let orderView = hasPermission(permissionList, Permission.MOBILEAPP_DASHBOARD_MENU_ORDER);
    let transferView = hasPermission(permissionList, Permission.MOBILEAPP_DASHBOARD_MENU_TRANSFER);
    let productView = hasPermission(permissionList, Permission.MOBILEAPP_DASHBOARD_MENU_PRODUCT);
    let ticketView = hasPermission(permissionList, Permission.MOBILEAPP_DASHBOARD_MENU_TICKET);

    const handleHomePress = () => {
        navigation.navigate("Dashboard");
        setSideMenuOpen && setSideMenuOpen(false);
    };

    const handleOrderPress = () => {
        navigation.navigate("Order");
        setSideMenuOpen && setSideMenuOpen(false);
    };

    const handleTransferPress = () => {
        navigation.navigate("inventoryTransfer");
        setSideMenuOpen && setSideMenuOpen(false);
    };
    const handleProductPress = () => {
        navigation.navigate("Products");
        setSideMenuOpen && setSideMenuOpen(false);
    };
    const handleTicketPress = () => {
        navigation.navigate("Ticket");
        setSideMenuOpen && setSideMenuOpen(false);
    };

    const handleReplenishPress = () => {
        navigation.navigate("ProductReplenish");
        setSideMenuOpen && setSideMenuOpen(false);
    }

    return (
        <View style={{ paddingHorizontal: 5, padding: 5, backgroundColor: Color.TOOL_BAR_BACKGROUND }}>
            <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                <ToolBarItem
                    icon="home"
                    label="Home"
                    onPress={handleHomePress}
                    selected={menuItemValue === IconValue.DASHBOARD}
                />
                {orderView && (
                    <ToolBarItem
                        icon="receipt"
                        label="Orders"
                        onPress={(e) => handleOrderPress()}
                        selected={menuItemValue === IconValue.ORDER}
                    />
                )}

                {replenishView && (
                    <ToolBarItem
                        icon="shipping-fast"
                        label="Replenish"
                        onPress={handleReplenishPress}
                        selected={menuItemValue === IconValue.REPLENISH}
                    />
                )}
                {transferView && (
                    <ToolBarItem
                        icon="truck-moving"
                        label="Transfers"
                        onPress={handleTransferPress}
                        selected={menuItemValue === IconValue.TRANSFER}
                    />
                )}
                {productView && (
                    <ToolBarItem
                        icon="box-open"
                        label="Products"
                        onPress={handleProductPress}
                        selected={menuItemValue === IconValue.PRODUCT}
                    />
                )}
                {ticketView && (
                    <ToolBarItem
                        icon="ticket-alt"
                        label="Tickets"
                        onPress={handleTicketPress}
                        selected={menuItemValue === IconValue.TICKET}
                    />
                )}



                <ToolBarItem
                    icon="bars"
                    label="Menu"
                    onPress={() => {
                        setMenuActive(true)
                        updateMenuState(true)}}
                     selected={menuItemValue === IconValue.MENU}
                />
            </View>
        </View>
    );
};

export default BottomToolBar;

const style = StyleSheet.create({
    container: {
        flex: 1,
        overflow: "scroll",
        backgroundColor: "#fff",
    },
    iconName: {
        marginTop: 5,
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        color: Color.ICONS_GREY
    },
});