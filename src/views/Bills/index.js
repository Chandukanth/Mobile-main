import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Layout from "../../components/Layout";
import Refresh from "../../components/Refresh";
import AlternativeColor from "../../components/AlternativeBackground";
import DeleteConfirmationModal from "../../components/Modal/DeleteConfirmationModal";
import { SwipeListView } from "react-native-swipe-list-view";
import { Color } from "../../helper/Color";
import NoRecordFound from "../../components/NoRecordFound";
import billService from "../../services/BillService";
import BillCard from "./component/BillCard";
import ShowMore from "../../components/ShowMore";
import Permission from "../../helper/Permission";
import PermissionService from "../../services/PermissionService";
const Bills = () => {
  const [bill, setBill] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const isFocused = useIsFocused();
  const [page, setPage] = useState(2);
  const [billDeleteModalOpen, setBillDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [HasMore, setHasMore] = useState(true);
  const [permission, setPermission] = useState("")
  const [deletePermission,setDeletePermission] = useState("");

  const navigation = useNavigation();
  const stateRef = useRef();
  useEffect(() => {
    if (isFocused) {
        getBillList();
    }
  }, [isFocused,refreshing, navigation]);

  useEffect(() => {
    let mount = true;
    mount && addPermission()
    //cleanup function
    return () => {
        mount = false;
    };
}, [refreshing]);

  const AddNew = () => {
    navigation.navigate("BillForm");
  };

  const addPermission = async () => {
    const addPermission = await PermissionService.hasPermission(Permission.BILL_ADD);
    setPermission(addPermission);
    const deletePermission = await PermissionService.hasPermission(Permission.BILL_DELETE);
    setDeletePermission(deletePermission);
}
  const getBillList = async () => {
    setIsLoading(true);
     await billService.search({sort : "updatedAt",sortDir : "DESC"}, response => {
      if (response) {
        setBill(response);
        setIsLoading(false);
        setPage(2);
    
      }
      
    });
  };

  const LoadMoreList = async () => {
    try {
        setIsFetching(true);

        let params = { page: page }

        billService.search(params, (response) => {

            let bills = response

            // Set response in state
            setBill((prevTitles) => {
                return [...new Set([...prevTitles, ...bills])];
            });
            setPage((prevPageNumber) => prevPageNumber + 1);
            setHasMore(bills.length > 0);
            setIsFetching(false);
        });
    } catch (err) {
        console.log(err);
        setIsLoading(false);
    }
};
  const billDelete = async () => {
    if (selectedItem) {
      billService.Delete(selectedItem.id, (error, response) => {
        getBillList()
      })
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
  const billDeleteModalToggle = () => {
    setBillDeleteModalOpen(!billDeleteModalOpen);
    clearRowDetail();
  }
  const renderHiddenItem = (data, rowMap) => {
    return (
      <View style={styles.swipeStyle}>
        <TouchableOpacity
          style={styles.actionDeleteButton}
          onPress={() => {
            billDeleteModalToggle()
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
    return (
     
      <View style={styles.container}>
          <BillCard
            billNumber={item.bill_number}
            accountName={item.account_name}
            billingName={item.billing_name}
            amount={item.net_amount}
            date={item.bill_date}
            status={item.status}
            index={index}     
            onPress={() => {
              navigation.navigate("BillForm", { item });
            }}          />
        </View>
    );
  };
  return (
    <Layout
      title='Bills'
      buttonLabel={permission ? "Add" : ""}
      buttonOnPress={AddNew}
      isLoading={isLoading}
      refreshing={refreshing}
      bottomToolBar={true}
    >
      <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>
      <View style={styles.container}>
        <DeleteConfirmationModal
          modalVisible={billDeleteModalOpen}
          toggle={billDeleteModalToggle}
          item={selectedItem}
          updateAction={billDelete}
          bottomToolBar={true}
          id={selectedItem?.id}
        />
        
          {bill && bill.length > 0 ? 
            <SwipeListView
              data={bill}
              renderItem={renderItem}
              renderHiddenItem={renderHiddenItem}
              rightOpenValue={-70}
              previewOpenValue={-40}
              previewOpenDelay={3000}
              disableRightSwipe={true}
              closeOnRowOpen={true}
              disableLeftSwipe={deletePermission? false : true}
              keyExtractor={item => String(item.id)}
            />
            :
            <NoRecordFound iconName={"receipt"}/>
          }
           <ShowMore List={bill} isFetching={isFetching} HasMore={HasMore} onPress={LoadMoreList} />

         </View>
      </Refresh>
    </Layout>
  )
}
export default Bills;
const styles = StyleSheet.create({
  container: {
      flex: 1,
      overflow: "scroll",
      backgroundColor: "#fff",
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
  
})