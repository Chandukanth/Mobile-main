import React from "react";

import { NativeModules } from "react-native"

import { NavigationContainer } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SafeAreaProvider } from "react-native-safe-area-context";

import Login from "./src/views/Login";

import Dashboard from "./src/views/dashboard/Dashboard";

import StockEntry from "./src/views/stockEntry";

import ProductList from "./src/views/stockEntry/ProductList";

import TransferProductList from "./src/views/inventoryTransfer/ProductsList";

import TransferProductSearch from "./src/views/inventoryTransfer/ProductSearch";

import Attendance from "./src/views/attendance";

import AttendanceForm from "./src/views/attendance/AttendanceForm";

import AttendanceDetail from "./src/views/attendance/AttendanceForm";

import InventoryTransfer from "./src/views/inventoryTransfer";

import Order from "./src/views/order";

import Products from "./src/views/product";

import AddProducts from "./src/views/product/AddProduct";

import ProductDetails from "./src/views/product/Detail";

import OrderProductList from "./src/views/order/OrderProductList";

import WishListProducts from "./src/views/wishList";

import ProductAdd from "./src/views/wishList/ProductAdd";

import SalesSettlementList from "./src/views/saleSettlement";

import SalesSettlementForm from "./src/views/saleSettlement/SalesSettlementForm";

import SaleSettlementDetail from "./src/views/saleSettlement/detail";

import Purchase from "./src/views/Purchase";

import PurchaseForm from "./src/views/Purchase/components/PurchaseForm";

import Attachment from "./src/views/saleSettlement/components/Media";

import OrderAddProduct from "./src/views/order/AddProduct";

import ShiftSelector from "./src/views/attendance/ShiftSelector";

import Activity from "./src/views/activity/Index";

import ActivityForm from "./src/views/activity/ActivityForm";

import Sync from "./src/components/Sync";

import SelectTransferType from "./src/views/inventoryTransfer/components/SelectTransferType";

import Media from "./src/components/MediaList";

import UserSelector from "./src/views/order/components/UserSelector";

import PurchaseMedia from "./src/views/Purchase/components/Media";

import OwnerSelector from "./src/views/stockEntry/components/OwnerSelection";

import NotesArea from "./src/views/inventoryTransfer/components/NotesArea";

import Replenish from "./src/views/replenish";

import StoreReplenish from "./src/views/replenish/storeReplenish";

import ProductReplenish from "./src/views/replenish/productReplenish";

import ReplenishmentProducts from "./src/views/replenish/replenishmentProduct";

const { BluetoothManager } = NativeModules;

let BluetoothSetting;

if (BluetoothManager) {
	BluetoothSetting = require("./src/views/settings/Bluetooth");
}

import PurchaseAdd from "./src/views/Purchase/PurchaseAdd";

import Settings from "./src/views/settings";

import StoreSetting from "./src/views/settings/Store";

import ActivityUser from "./src/views/activity/Components/ActivityUser";

import Ticket from "./src/views/Ticket";

import Fine from "./src/views/fine";

import FineForm from "./src/views/fine/FineForm";

import TicketForm from "./src/views/Ticket/TicketForm";

import TicketDetail from "./src/views/Ticket/detail";

import Store from "./src/views/store";

import StoreDetail from "./src/views/store/detail";

import MessagePage from "./src/views/Messages/detail";

import ChatUsers from "./src/views/Messages";

import NewChat from "./src/views/Messages/newMessage";

import NoInternetConnection from "./src/components/NoInternetScreen";

import Visitor from "./src/views/Visitor";

import VisitorForm from "./src/views/Visitor/VisitorForm";

import CandidateProfile from "./src/views/CandidateProfile";

import CandidateForm from "./src/views/CandidateProfile/CandidateForm";

import Payments from "./src/views/Payments";

import ForgotPassword from "./src/views/ForgotPassword";


const Stack = createNativeStackNavigator();

import { navigationRef } from './src/lib/RootNavigation';
import Reports from "./src/views/reports";

import StoreSelector from "./src/views/store/StoreSelector";

import inspections from "./src/views/inspections";

import InspectionForm from "./src/views/inspections/InspectionForm";

import TypeSelector from "./src/views/inspections/TypeSelector";

import Invoice from "./src/views/order/Invoice";

import Users from "./src/views/Users";

import UserForm from "./src/views/Users/UserForm";

import PaymentForm from "./src/views/Payments/PaymentForm";


import Bills from "./src/views/Bills";

import BillForm from "./src/views/Bills/BillForm";

import MediaUpload from "./src/components/MediaUpload";

import OrderSalesSettlementDiscrepancyReport from "./src/views/OrderSalesSettlementDiscrepancyReport"

export default function App() {

	return (
		<SafeAreaProvider>
			<NavigationContainer ref={navigationRef}>
				<Stack.Navigator
					screenOptions={{
						headerShown: false,
					}}
					initialRouteName="Login"
				>
					{/* STORE ROUTES */}
					<Stack.Screen name="Login" component={Login} />

					<Stack.Screen name="ForgotPassword" component={ForgotPassword} />


					<Stack.Screen name="Dashboard" component={Dashboard} />

					<Stack.Screen name="NoInternet" component={NoInternetConnection} />

					<Stack.Screen name="StockEntry" component={StockEntry} />

					<Stack.Screen name="StockEntry/Product" component={ProductList} />

					<Stack.Screen name="StockEntry/OwnerSelect" component={OwnerSelector} />

					{/* Attendance */}
					<Stack.Screen name="Attendance" component={Attendance} />

					<Stack.Screen name="/Attendance/form" component={AttendanceForm} />

					<Stack.Screen name="/Attendance/Detail" component={AttendanceDetail} />

					{/* Inventory Transfer  */}
					<Stack.Screen name="inventoryTransfer" component={InventoryTransfer} />

					<Stack.Screen name="inventoryTransfer/NotesArea" component={NotesArea} />

					<Stack.Screen name="Transfer/ProductSearch" component={TransferProductSearch} />

					<Stack.Screen name="Transfer/ProductList" component={TransferProductList} />

					{/* Products  */}
					<Stack.Screen name="Products" component={Products} />

					<Stack.Screen name="Products/Add" component={AddProducts} />

					<Stack.Screen name="Products/Details" component={ProductDetails} />


					{/* Order  */}
					<Stack.Screen name="Order/ProductList" component={OrderProductList} />

					<Stack.Screen name="Order/OrderProductAdd" component={OrderAddProduct} />

					<Stack.Screen name="Order" component={Order} />

					<Stack.Screen name="shiftSelect" component={ShiftSelector} />

					<Stack.Screen name="Order/userSelect" component={UserSelector} />

					<Stack.Screen name="Order/Invoice" component={Invoice} />

					{/* Out Of Stock Products */}
					<Stack.Screen name="WishListProducts" component={WishListProducts} />

					<Stack.Screen name="ProductAdd" component={ProductAdd} />

					{/* Sale */}
					<Stack.Screen name="SalesSettlement" component={SalesSettlementList} />

					<Stack.Screen name="SalesSettlementForm" component={SalesSettlementForm} />

					<Stack.Screen name="SalesSettlement/Detail" component={SaleSettlementDetail} />

					<Stack.Screen name="MediaUpload" component={MediaUpload} />


					{/* Bill */}
					<Stack.Screen name="Purchase" component={Purchase} />

					<Stack.Screen name="PurchaseForm" component={PurchaseForm} />

					<Stack.Screen name="PurchaseAdd" component={PurchaseAdd} />

					<Stack.Screen name="PurchaseMedia" component={PurchaseMedia} />

					{/* {Attachment} */}
					<Stack.Screen name="Media" component={Attachment} />

					<Stack.Screen name="MediaList" component={Media} />

					{/* Activity */}
					<Stack.Screen name="ActivityList" component={Activity} />

					<Stack.Screen name="ActivityForm" component={ActivityForm} />

					<Stack.Screen name="ActivityUserSelector" component={ActivityUser} />

					<Stack.Screen name="Sync" component={Sync} />

					<Stack.Screen name="/SelectTransferType" component={SelectTransferType} />

					{/* Ticket */}

					<Stack.Screen name="Ticket" component={Ticket} />

					<Stack.Screen name="Ticket/Add" component={TicketForm} />

					<Stack.Screen name="Ticket/Detail" component={TicketDetail} />

					{/* Fine */}
					<Stack.Screen name="Fine" component={Fine} />

					<Stack.Screen name="FineForm" component={FineForm} />


					{/* Settings */}
					<Stack.Screen name="Settings" component={Settings} />

					{/* Visitor */}

					<Stack.Screen name="Visitor" component={Visitor} />

					<Stack.Screen name="Visitor/Form" component={VisitorForm} />


					{/* CandidateProfile  */}

					<Stack.Screen name="CandidateProfile" component={CandidateProfile} />

					<Stack.Screen name="CandidateProfile/Form" component={CandidateForm} />

					{/* {Users} */}

					<Stack.Screen name="Users" component={Users} />
					<Stack.Screen name="UserForm" component={UserForm} />

					{/* {Bills} */}

					<Stack.Screen name="Bills" component={Bills} />
					<Stack.Screen name="BillForm" component={BillForm} />

                {/* {OrderSales Report} */}

				<Stack.Screen name="OrderSalesSettlementDiscrepancyReport" component={OrderSalesSettlementDiscrepancyReport}/>

					{/* Payments */}
					<Stack.Screen name="Payments" component={Payments} />

					<Stack.Screen name="Payments/Form" component={PaymentForm} />

					{/* Sub Settings */}
					{BluetoothSetting && (
						<Stack.Screen name="Bluetooth/Setting" component={BluetoothSetting} />
					)}

					<Stack.Screen name="Settings/SelectStore" component={StoreSetting} />

					<Stack.Screen name="Location" component={Store} />

					<Stack.Screen name="StoreDetail" component={StoreDetail} />

					<Stack.Screen name="Replenish" component={Replenish} />

					<Stack.Screen name="StoreReplenish" component={StoreReplenish} />

					<Stack.Screen name="ProductReplenish" component={ProductReplenish} />

					<Stack.Screen name="ReplenishmentProduct" component={ReplenishmentProducts} />
					<Stack.Screen name="Reports" component={Reports} />

					<Stack.Screen name="Messages/Detail" component={MessagePage} />

					<Stack.Screen name="Messages" component={ChatUsers} />

					<Stack.Screen name="Messages/New" component={NewChat} />

					<Stack.Screen name="StoreSelector" component={StoreSelector} />

					<Stack.Screen name="Inspection" component={inspections} />

					<Stack.Screen name="InspectionForm" component={InspectionForm} />

					<Stack.Screen name="TypeSelect" component={TypeSelector} />

				</Stack.Navigator>
			</NavigationContainer>
		</SafeAreaProvider>
	);
}
