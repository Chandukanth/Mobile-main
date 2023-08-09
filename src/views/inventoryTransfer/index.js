// Import React and Component
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Keyboard
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "../../lib/AsyncStorage";
import dateTime from "../../lib/DateTime";
import Layout from "../../components/Layout";
import InventoryTransferService from "../../services/InventoryTransferService";
import { useIsFocused } from "@react-navigation/native";
import { Color } from "../../helper/Color";
import { FontAwesome5 } from "@expo/vector-icons";
import InventoryCard from "./components/TransferCard";
import apiClient from "../../apiClient";
import { endpoints } from "../../helper/ApiEndPoint";
import { SwipeListView } from "react-native-swipe-list-view";
import Permission from "../../helper/Permission";
import StockDeleteModal from "../../components/Modal/StockDeleteModal";
import AsyncStorageConstants from "../../helper/AsyncStorage";
import TransferType from "../../helper/TransferType";
import TransferTypeService from "../../services/TransferTypeService";
import inventoryTransferService from "../../services/InventoryTransferService";
import DateTime from "../../lib/DateTime";
import BarCodeScanner from "../../components/BarcodeScanner";
import ConfirmationModal from "../../components/Modal/ConfirmationModal";
import AlertMessage from "../../helper/AlertMessage";
import { MenuItem } from "react-native-material-menu";
import AlternativeColor from "../../components/AlternativeBackground";
import ShowMore from "../../components/ShowMore";
import Refresh from "../../components/Refresh";
import PermissionService from "../../services/PermissionService"
import DateFilter, { Filter } from "../../components/DateFilter";
import { useForm } from "react-hook-form";

const InventoryTransfer = (props) => {
  let params = props?.route?.params
  const [inventoryTransferList, setInventoryTransferList] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [isFetching, setIsFetching] = useState(false);
  //setting tha initial page
  const [page, setPage] = useState(2);
  //we need to know if there is more data
  const [HasMore, setHasMore] = useState(true);

  const [allTransfer, setAlltransfer] = useState("")

  const [StockDeleteModalOpen, setStockDeleteModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState("");

  const [refreshing, setRefreshing] = useState(false);

  const [manageOther, setManageOther] = useState(false);

  const [transferTypeList, setTransferTypeList] = useState([]);

  const [storeId, setSelectedLocationId] = useState("");

  const [storeName, setSelectedLocationName] = useState("")

  const [modalVisible, setScanModalVisible] = useState(false);

  const [transferNotFoundModalOpen, setTransferNotFoundModalOpen] = useState(false);

  const [scannedCode, setScannedCode] = useState("");

  const [filter, SetFilter] = useState(params?.filter ? params?.filter : Filter.TODAY)

  const [visible, setVisible] = useState(false)

  const [selectedFilter, setSelectedFilter] = useState(Filter.TODAY_VALUE)

  const [actionList, setActionList] = useState()

  const stateRef = useRef();

  const isFocused = useIsFocused();

  const [id, setId] = useState(id);

  const [type , setType] = useState("")
  // render the inventory list function
  useEffect(() => {
    let mount = true;

    mount && getTransferTypeByRole();

    mount && getStoreDetail();

    mount && getPermission();

    mount && getActionItem()
    if (params?.filter === Filter.ALL || selectedFilter === Filter.ALL_VALUE) {
      getAllList();
    } else if (params?.filter === Filter.TODAY || selectedFilter === Filter.TODAY_VALUE) {
      getTodayList();
    }

    //cleanup function
    return () => {
      mount = false;
    };
  }, [isFocused, refreshing]);


  useEffect(() => {
    getActionItem()
  }, [selectedFilter])

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
  });

  const getStoreDetail = async () => {

    try {
      await AsyncStorage.getItem(AsyncStorageConstants.SELECTED_LOCATION_ID).then((res) => setSelectedLocationId(res))
      await AsyncStorage.getItem(AsyncStorageConstants.SELECTED_LOCATION_NAME).then((res) => setSelectedLocationName(res))

    }
    catch (error) {
      console.log(error);

    }

  }

  const navigation = useNavigation();

  const getTransferTypeByRole = () => {
    TransferTypeService.searchByRole(null, (error, response) => {
      if (response && response.data && response.data.data) {
        setTransferTypeList(response.data.data)
      }
    })
  }

  const transferNotFoundToggle = () => {
    setTransferNotFoundModalOpen(!transferNotFoundModalOpen);
  }


  const LoadMoreList = async () => {
    try {
      setIsFetching(true);

      let params  

      if (allTransfer) {
        params = { page: page, sort: "createdAt", sortDir: "DESC" , type : type};
      } else {
        params = { page: page,type : type, sort: "createdAt", sortDir: "DESC", startDate: dateTime.formatDate(new Date()), endDate: dateTime.toISOEndTimeAndDate(new Date()) };
      }
      inventoryTransferService.search(params, (error, response) => {

        let inventoryTransferList = response?.data?.data;
          setInventoryTransferList((prevTitles) => {
            return [...new Set([...prevTitles, ...inventoryTransferList])];
          });
          setPage((prevPageNumber) => prevPageNumber + 1);
          setHasMore(inventoryTransferList.length > 0);
          setIsFetching(false);
        });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

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
    let index = data?.index;
    const containerStyle = AlternativeColor.getBackgroundColor(index)
    return (
      <View >
        <InventoryCard
          fromLocationName={item?.fromLocationName}
          toLocationName={item?.toLocationName}
          status={item?.status}
          statusColor={item.statusColor}
          date={item?.date}
          type={item?.type}
          id={id}
          item={item}
          alternative={containerStyle}
          transferNumber={item?.transfer_number}
          onPress={() => {
            inventoryClickHandler(item);
          }}
        />
      </View>
    );
  };

  const getPermission = async () => {
    let manageOther = await PermissionService.hasPermission(Permission.TRANSFER_MANAGE_OTHERS)
    setManageOther(manageOther)

  }

  const inventoryClickHandler = async (item) => {

    if (item) {
      let isOfflineMode = item?.offlineMode == TransferType.OFFLINE_MODE ? true : false;

      if (isOfflineMode) {
        await InventoryTransferService.syncInventory(item);
      }

      setId(item.id)
      navigation.navigate("Transfer/ProductList", {
        transferId: item?.id,
        toLocationId: item?.to_store_id,
        fromLocationId: item?.from_store_id,
        date: item?.date,
        type: item?.type_id,
        fromLocationName: item?.fromLocationName,
        toLocationName: item?.toLocationName,
        notes: item?.notes,
        offlineMode: item?.offlineMode == TransferType.OFFLINE_MODE ? true : false,
        currentStatusId: item?.currentStatusId,
        transferNumber: item?.transfer_number,
        filter: filter,
        printName: item?.printName
      });
    }
  }

  const transferDelete = async () => {
    if (selectedItem) {
      InventoryTransferService.DeleteTransfer(selectedItem.id, (error, response) => {
        InventoryTransferService.getInventoryList(
          setPage,
          setHasMore,
          setIsLoading,
          setInventoryTransferList
        );
      })
    }
  };
  const getTodayList = async (type) => {
    setIsLoading(true)
    try {
      let param
      Keyboard.dismiss();
      setPage(2);
      setHasMore("0");
      if (type) {
        param = { type: type, startDate: dateTime.formatDate(new Date()), endDate: dateTime.toISOEndTimeAndDate(new Date()) }
      } else {
        param = { startDate: dateTime.formatDate(new Date()), endDate: dateTime.toISOEndTimeAndDate(new Date()) }
      }
      InventoryTransferService.search(param, (err, response) => {
        let transfers = response && response?.data && response?.data?.data;
        setInventoryTransferList(transfers);
        setIsLoading(false);
        setVisible(false)
        setAlltransfer("");
        SetFilter(Filter.TODAY)


      })
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const getAllList = async (type) => {
    setIsLoading(true)
    try {
      let param
      Keyboard.dismiss();
      setPage(2);
      setHasMore("0");
      if (type) {
        param = { type: type }
      } else {
        param = null
      }
      InventoryTransferService.search(param, (err, response) => {
        let transfers = response && response?.data && response?.data?.data;
        setInventoryTransferList(transfers);
        setIsLoading(false);
        setVisible(false)
        setAlltransfer(transfers);

        SetFilter(Filter.ALL)

      })
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };



  const toggle = () => {
    setScanModalVisible(!modalVisible);
  }

  const addNewTransfer = () => {
    inventoryTransferService.onTransferTypeClickStoreSelect(transferTypeList, navigation);
  }

  const getActionItem = () => {

    let transferType = new Array();
    TransferTypeService.searchByRole({sort : "name" }, (error, response) => {
         let  transferTypeList = response.data.data 
    if (transferTypeList && transferTypeList.length > 0) {
      transferTypeList.forEach((data) => {
        transferType.push(
          <MenuItem onPress={() => {
            setVisible(true);
            if (selectedFilter == Filter.ALL_VALUE) {
              getAllList(data.id);
              setType(data.id)

            } else if (selectedFilter == Filter.TODAY_VALUE) {
              getTodayList(data.id);
              setType(data.id)
            }
          }} style={{ paddingHorizontal: 10 }}>
            {data.name}
          </MenuItem>
        )
      })
    }


    setActionList(transferType);
  })
  }

  const onScanAction = async (item) => {

    if (item) {
      let isOfflineMode = item?.offlineMode == TransferType.OFFLINE_MODE ? true : false;

      if (isOfflineMode) {
        await InventoryTransferService.syncInventory(item);
      }

      setId(item.id)
      navigation.navigate("Transfer/ProductList", {
        transferId: item?.id,
        toLocationId: item?.to_store_id,
        fromLocationId: item?.from_store_id,
        date: item?.date,
        type: item?.type,
        fromLocationName: item?.fromLocationName,
        toLocationName: item?.toLocationName,
        notes: item?.notes,
        offlineMode: item?.offlineMode == TransferType.OFFLINE_MODE ? true : false,
        currentStatusId: item?.statusId,
        transferNumber: item?.transfer_number,
        printName: item?.printName
      });
    }
  }


  const handleScannedData = async (data) => {
    try {
      //get bar code
      let barCode = data?.data;

      setScannedCode(barCode)

      setScanModalVisible(false);

      //validate bar code exist and loading
      if (barCode) {

        inventoryTransferService.get(barCode, response => {

          //validate store product exist or not
          if (response) {

            onScanAction(response);


          } else {

            transferNotFoundToggle();
          }

        })

      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDateFilterChange = (values) => {
    setSelectedFilter(values)
    if (values === Filter.TODAY_VALUE) {
      getTodayList()
    } else {
      getAllList()
    }

  }




  /* Render flat list function end */
  return (
    <Layout title={"Transfer"}
      buttonLabel="New"
      buttonOnPress={() => {
        addNewTransfer()
      }}
      closeModal={visible}
      isLoading={isLoading}
      hideFooterPadding={true}
      bottomToolBar={true}
      showScanner={true}
      showActionMenu
      actionItems={actionList}
      openScanner={toggle}
      filter={
        <DateFilter
          handleDateFilterChange={handleDateFilterChange}
          control={control}
          data={selectedFilter}
        />}

    >
      <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>

        <StockDeleteModal
          modalVisible={StockDeleteModalOpen}
          toggle={stockDeleteModalToggle}
          item={selectedItem}
          updateAction={transferDelete}
          transfer
        />
        <BarCodeScanner
          toggle={toggle}
          modalVisible={modalVisible}
          handleScannedData={handleScannedData}
        />

        <ConfirmationModal
          toggle={transferNotFoundToggle}
          modalVisible={transferNotFoundModalOpen}
          title={AlertMessage.TRANSFER_NOT_FOUND}
          description={`BarCode ID '${scannedCode}' not found please scan different code`}
          confirmLabel={"Ok"}
          ConfirmationAction={transferNotFoundToggle}
        />


        <View>
          {inventoryTransferList && inventoryTransferList.length > 0 ?
            <>
              <SwipeListView
                data={inventoryTransferList}
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

            </>
            : (
              <View
                style={{
                  alignItems: "center",
                  paddingVertical: 350,
                }}
              >
                <FontAwesome5 name="truck-moving" size={20} color={Color.PRIMARY} />
                <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                  No Records Found
                </Text>
              </View>
            )}
        </View>

        <>
          <ShowMore List={inventoryTransferList} isFetching={isFetching} HasMore={HasMore} onPress={LoadMoreList} />
        </>
      </Refresh>
    </Layout>
  );
};

export default InventoryTransfer;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    overflow: "scroll",
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


