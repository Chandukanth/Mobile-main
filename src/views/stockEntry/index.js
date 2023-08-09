// Import React and Component
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
	StyleSheet,
	View,
	Text,
	FlatList,
	TouchableOpacity,
	ScrollView
} from "react-native";

import { useNavigation } from "@react-navigation/native";

// icons
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "../../lib/AsyncStorage";

import AsyncStorageConstants from "../../helper/AsyncStorage";
import apiClient from "../../apiClient";
import { endpoints } from "../../helper/ApiEndPoint";

// Spinner

import { useIsFocused } from "@react-navigation/native";

import Layout from "../../components/Layout";

import { Color } from "../../helper/Color";

import { FontAwesome5 } from "@expo/vector-icons";

import { SwipeListView } from "react-native-swipe-list-view";
import stockEntryService from "../../services/StockEntryService";
import Permission from "../../helper/Permission";
import StockDeleteModal from "../../components/Modal/StockDeleteModal";
import StockEntryCard from "./components/StockEntryCard";
import ShowMore from "../../components/ShowMore";

const Index = () => {

	const [stockEntryList, setStockEntryList] = useState("");

	const [isLoading, setIsLoading] = useState(false);

	const [isFetching, setIsFetching] = useState(false);
	//setting tha initial page
	const [page, setPage] = useState(2);
	//we need to know if there is more data
	const [HasMore, setHasMore] = useState(true);

	const [StockDeleteModalOpen, setStockDeleteModalOpen] = useState(false);

	const [selectedItem, setSelectedItem] = useState("");

	const [selectedRowMap, setSelectedRowMap] = useState("");

	const [manageOther, setManageOther] = useState(false);

	const [totalStock, setTotalStock] = useState();

	const [storeId, setStoreId] = useState("");

	const [locationName, setName] = useState("");

	const [ownerName, setOwnerName] = useState("");


	const stateRef = useRef();

	const isFocused = useIsFocused();

	const navigation = useNavigation();


	// render the stock entry list function
	useEffect(() => {
		let mount = true;

		mount &&
			stockEntryService.getStockList(
				setPage,
				setHasMore,
				setIsLoading,
				setTotalStock,
				setStockEntryList
			);

		//cleanup function
		return () => {
			mount = false;
		};
	}, [isFocused, navigation]);

	useEffect(() => {
		let mount = true;

		//get permission
		mount && getPermission();
		mount && storeSelect();
		return () => {
			mount = false;
		}
	}, [])

	useEffect(() => {
		storeSelect();
	}, [isFocused])


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
					permissionList.find((option) => option.role_permission === Permission.STOCK_ENTRY_MANAGE_OTHERS)
					? true
					: false;
				//set all user
				setManageOther(manageOther)
			}
		}
	}

	const storeSelect = async () => {
		await AsyncStorage.getItem(AsyncStorageConstants.SELECTED_LOCATION_ID).then((res) => setStoreId(res))
		await AsyncStorage.getItem(AsyncStorageConstants.SELECTED_LOCATION_NAME).then((res) => setName(res))
		await AsyncStorage.getItem(AsyncStorageConstants.USER_NAME).then((res) => setOwnerName(res));

	}

	const onSelectStore = (selectedStore) => {
		if (selectedStore) {
			stockEntryService.addStockEntry(selectedStore.id, new Date(), async (error, response) => {
				if (response && response.data) {
					await stockEntryService.syncStockEntry(response.data.stockEntryDetails);
					navigation.navigate("StockEntry/Product", {
						stockEntryId: response.data.stockEntryDetails.id,
						storeId: storeId,
						locationName: locationName,
						date: response.data.stockEntryDetails.date,
						owner: ownerName,
						isNewStockEntry: true

					});
				}
			});
		}
	}

	const AddNew = () => {
		if (!storeId) {
			navigation.navigate("StoreSelector", {
				onSelectStore: onSelectStore
			});
		} else {
			stockEntryService.addStockEntry(storeId, new Date(), async (error, response) => {
				if (response && response.data) {
					await stockEntryService.syncStockEntry(response.data.stockEntryDetails);
					navigation.navigate("StockEntry/Product", {
						stockEntryId: response.data.stockEntryDetails.id,
						storeId: storeId,
						locationName: locationName,
						date: response.data.stockEntryDetails.date,
						owner: ownerName,
						isNewStockEntry: true

					});
				}
			});
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

	const stockDeleteModalToggle = () => {
		setStockDeleteModalOpen(!StockDeleteModalOpen);
		clearRowDetail();
	}

	const renderHiddenItem = (data, rowMap) => {
		return (
			<View style={styles.swipeStyle}>
				<TouchableOpacity
					style={styles.actionDeleteButton}
					onPress={() => {
						stockDeleteModalToggle()
						setSelectedItem(data?.item);
						setSelectedRowMap(rowMap);
						stateRef.selectedItem = data?.item;
						stateRef.selecredRowMap = rowMap;
						closeRow(rowMap, data?.item.id);
					}}
				>
					<Text style={styles.btnText}>Delete</Text>
				</TouchableOpacity>
			</View>

		)
	};

	const renderItem = data => {
		let item = data?.item;
		return (
			<StockEntryCard
				onPress={() => {
					stockEntryService.syncStockEntry(item);
					navigation.navigate("StockEntry/Product", {
						stockEntryId: item?.id,
						locationName: item?.location,
						storeId: item?.store_id,
						date: item?.date,
						owner: item?.owner_first_name,
						status: item.status
					});
				}}
				stock_entry_number={item.stock_entry_number}
				date={item.date}
				store={item.location}
				firstName={item.owner_first_name}
				lastName={item.owner_last_name}
				status={item.status}
			/>
		);
	};


	const LoadMoreList = async () => {
		try {
			setIsFetching(true);

			apiClient.get(
				`${endpoints().stockEntry
				}/search?page=${page}&sort=${"createdAt"}&sortDir=${"DESC"}`
				, (error, response) => {
					let stockEntryData = response?.data?.data;
					// Set response in state
					setStockEntryList((prevTitles) => {
						return [...new Set([...prevTitles, ...stockEntryData])];
					});
					setPage((prevPageNumber) => prevPageNumber + 1);
					setHasMore(stockEntryData.length > 0);
					setIsFetching(false);
				});
		} catch (err) {
			console.log(err);
			setIsLoading(false);
		}
	}

	const stockEntryDelete = async () => {
		if (selectedItem) {
			stockEntryService.DeleteStockEntry(selectedItem.id, (error, response) => {
				stockEntryService.getStockList(
					setPage,
					setHasMore,
					setIsLoading,
					setTotalStock,
					setStockEntryList
				);
			})
		}
	};



	/* Render flat list funciton end */

	return (
		<Layout title={"Stock"} buttonLabel={"New"} buttonOnPress={AddNew} isLoading={isLoading} bottomToolBar={true}>
			<ScrollView
				keyboardShouldPersistTaps="handled"
			>
				<View style={styles.container}>

					<StockDeleteModal
						modalVisible={StockDeleteModalOpen}
						toggle={stockDeleteModalToggle}
						item={selectedItem}
						updateAction={stockEntryDelete}
						bottomToolBar={true}
					/>


					{stockEntryList && stockEntryList.length > 0 ?
						<SwipeListView
							data={stockEntryList}
							renderItem={renderItem}
							renderHiddenItem={renderHiddenItem}
							rightOpenValue={-70}
							previewOpenValue={-40}
							previewOpenDelay={3000}
							disableRightSwipe={true}
							disableLeftSwipe={manageOther ? false : true}
							closeOnRowOpen={true}
							keyExtractor={item => String(item.id)}
						/>

						: <View style={{ display: 'flex', justifyContent: 'center', alignItems: "center", paddingVertical: 350 }}>
							<FontAwesome5 name="warehouse" size={20} color={Color.PRIMARY} />
							<Text style={{ fontWeight: "bold" }}>No Records Found</Text>
						</View>}
				</View>

				<ShowMore List={stockEntryList} isFetching={isFetching} HasMore={HasMore} onPress={LoadMoreList} />

			</ScrollView>
		</Layout>
	);
};

export default Index;

const styles = StyleSheet.create({

	container: {
		flex: 1,
		overflow: "scroll",
		backgroundColor: "#fff",
	},
	card: {
		paddingLeft: 20,
		height: 70,
		backgroundColor: "#fff",
		borderColor: "#fff",
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
	actionDeleteButton: {
		alignItems: 'center',
		bottom: 10,
		justifyContent: 'center',
		position: 'absolute',
		top: 16,
		width: 70,
		backgroundColor: '#D11A2A',
		right: 7
	},
	btnText: {
		color: Color.WHITE,
	},


});
