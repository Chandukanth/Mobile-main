import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import userService from "../../services/UserService";
import Layout from "../../components/Layout";
import Refresh from "../../components/Refresh";
import AlternativeColor from "../../components/AlternativeBackground";
import ShowMore from "../../components/ShowMore";
import UserCard from "../../components/UserCard";
import DeleteConfirmationModal from "../../components/Modal/DeleteConfirmationModal";
import { SwipeListView } from "react-native-swipe-list-view";
import { Color } from "../../helper/Color";
import NoRecordFound from "../../components/NoRecordFound";
import Status from "../../helper/Status";


const Users = () => {
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const isFocused = useIsFocused();
  const [page, setPage] = useState(2);
  const [userDeleteModalOpen, setUserDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [HasMore, setHasMore] = useState(true);
  const navigation = useNavigation();
  const stateRef = useRef();



  useEffect(() => {
    if (isFocused) {
      getUserList();
    }

  }, [isFocused,refreshing, navigation]);

  const AddNew = () => {
    navigation.navigate("UserForm");
  };

  const getUserList = async () => {
    setPage(2);
    setHasMore("0");
    setIsLoading(true);

     await userService.search({page : 1,status : Status.ACTIVE}, response => {
      if (response) {
        setUser(response);
        setIsLoading(false);
    
      }
      
    });
  };

  const LoadMoreList = async () => {
    try {
        setIsFetching(true);

        let params = { page: page,status : Status.ACTIVE }

        userService.search(params, (response) => {

            let users = response

            // Set response in state
            setUser((prevTitles) => {
                return [...new Set([...prevTitles, ...users])];
            });
            setPage((prevPageNumber) => prevPageNumber + 1);
            setHasMore(users.length > 0);
            setIsFetching(false);
        });
    } catch (err) {
        console.log(err);
        setIsLoading(false);
    }
};
  const userDelete = async () => {
    if (selectedItem) {
      userService.Delete(selectedItem.id, (error, response) => {
        getUserList()
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
  const userDeleteModalToggle = () => {
    setUserDeleteModalOpen(!userDeleteModalOpen);
    clearRowDetail();
  }
  const renderHiddenItem = (data, rowMap) => {
    return (
      <View style={styles.swipeStyle}>
        <TouchableOpacity
          style={styles.actionDeleteButton}
          onPress={() => {
            userDeleteModalToggle()
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
      <TouchableOpacity  activeOpacity={1.2} >
        <View style={[containerStyle, { padding: 5 }]}>
          <UserCard
            firstName={item.fullname}
            mobileNumber={item.mobileNumber}
            email={item.email}
            image={item.media_url}
            size={55}
            onPress={() => {
              navigation.navigate("UserForm", { item });
            }}
            
          />
        </View>
      </TouchableOpacity>
    );
  };



  return (
    <Layout
      title='Users'
      buttonLabel={"Add"}
      buttonOnPress={AddNew}
      isLoading={isLoading}
      refreshing={refreshing}
      bottomToolBar={true}

    >
      <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>
      <View style={styles.container}>

        <DeleteConfirmationModal
          modalVisible={userDeleteModalOpen}
          toggle={userDeleteModalToggle}
          item={selectedItem}
          updateAction={userDelete}
          bottomToolBar={true}
          id={selectedItem?.id}

        />

        
          {user && user.length > 0 ? 
            <SwipeListView
              data={user}
              renderItem={renderItem}
              renderHiddenItem={renderHiddenItem}
              rightOpenValue={-70}
              previewOpenValue={-40}
              previewOpenDelay={3000}
              disableRightSwipe={true}
              disableLeftSwipe={false}
              closeOnRowOpen={true}
              keyExtractor={item => String(item.id)}
            />
            :
            <NoRecordFound iconName={"receipt"}/>
          }
           <ShowMore List={user} isFetching={isFetching} HasMore={HasMore} onPress={LoadMoreList} />



         </View>

      </Refresh>


    </Layout>
  )
}
export default Users;
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


