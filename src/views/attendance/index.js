// Import React and Component
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import Layout from "../../components/Layout";
import { useIsFocused } from "@react-navigation/native";
import AttendanceService from "../../services/AttendanceService";
import DateTime from "../../lib/DateTime";
import { useNavigation } from "@react-navigation/native";
import UserAvatar from "react-native-user-avatar";
import Permission from "../../helper/Permission";
import { Color } from "../../helper/Color";
import PermissionService from "../../services/PermissionService";
import CheckOutButton from "../../components/CheckOutButton";
import DeleteModal from "../../components/Modal/DeleteConfirmationModal";
import { SwipeListView } from "react-native-swipe-list-view";
import attendanceService from "../../services/AttendanceService";
import ApplyLeaveModal from "../../components/Modal/GeneralModal";
import DatePicker from "../../components/DatePicker"
import { MenuItem } from "react-native-material-menu";
import ShowMore from "../../components/ShowMore";
import Refresh from "../../components/Refresh";
import NoRecordFound from "../../components/NoRecordFound";
import Media from "../../helper/Media";
import asyncStorageService from "../../services/AsyncStorageService";
import ObjectName from "../../helper/ObjectName";
import { Image } from "react-native";
import AlternativeColor from "../../components/AlternativeBackground"
import Button from "../../components/Button";


const AttendanceList = (props) => {
  const [attendanceList, setAttendanceList] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(1);
  const [HasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [attendanceDeleteModal, setattendanceDeleteModal] = useState(false);
  const [attendanceManageOthersPermission, setAttendanceManageOthersPermission] = useState();
  const [selectedItem, setSelectedItem] = useState("");
  const [attendanceDeletePermission, setAttendanceDeletePermission] = useState('')
  const [applyLeaveModal, setApplyLeaveModal] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [visible, setIsVisible] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [attendanceCheckinCheckPermission, setAttendanceCheckinCheckPermission] = useState("")
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const stateRef = useRef();

  useEffect(() => {
    if (isFocused) {
      let mount = true;
      mount && getAttendanceList();
      mount && getDeletePermission();
      mount && getPermission();
      //cleanup function
      return () => {
        mount = false;
      };
    }
  }, [isFocused, refreshing]);

  const onDateSelect = (value) => {
    setSelectedDate(new Date(value))
  }

  const getAttendanceList = () => {
    // setIsFetching(true);
    setPage(2);
    setHasMore("0");
    !refreshing && setIsLoading(true);
    //default params
    let params = { page: 1 };
    //get attendance list
    AttendanceService.getAttendanceList(navigation, params, (err, attendanceList) => {
      setAttendanceList(attendanceList);
      setIsLoading(false);
      if (err) {
        console.error(err);
        setIsLoading(false);

      }
    });
  };

  const attendanceDeleteToggle = () => {
    setattendanceDeleteModal(!attendanceDeleteModal);
    clearRowDetail();
  }

  const applyleaveToggle = () => {
    setApplyLeaveModal(!applyLeaveModal);
    setIsVisible(false)
    setSelectedDate(new Date())
  }
  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  }
  const applyLeave = async () => {
    const selectedUser = await asyncStorageService.getUserId()
    let createData = {
      user: selectedUser,
      type: "Leave",
      date: selectedDate,
    }
    attendanceService.Leave(createData, (err, response) => {
      if (response) {
        getAttendanceList();
        setIsVisible(false)
      }
    })

  }

  const clearRowDetail = () => {
    if (stateRef) {
      const selectedItem = stateRef.selectedItem;
      const selectedRowMap = stateRef.selecredRowMap;
      if (selectedItem && selectedRowMap) {
        closeRow(selectedRowMap, selectedItem.inventoryTransferProductId)
        setSelectedItem("");
        stateRef.selectedItem = "";
        stateRef.selecredRowMap = "";
      }
    }
  }

  const renderHiddenItem = (data, rowMap) => {

    return (
      <View style={styles.swipeStyle}>
        <TouchableOpacity
          style={styles.actionDeleteButton}
          onPress={() => {
            attendanceDeleteToggle()
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


  const LoadMoreList = async () => {
    try {
      setIsFetching(true);

      let params = { page: page }

      AttendanceService.getAttendanceList(null, params, (error, response) => {

        let attendanceList = response;

        // Set response in state
        setAttendanceList((prevTitles) => {
          return [...new Set([...prevTitles, ...attendanceList])];
        });
        setPage((prevPageNumber) => prevPageNumber + 1);
        setHasMore(attendanceList.length > 0);
        setIsFetching(false);
      });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const addNew = async () => {
    navigation.navigate("shiftSelect", {
      showAllowedShift: true,
      redirectionUrl: "Attendance",
      navigation: navigation
    })
  };
  const getPermission = async () => {
    const isExist = await PermissionService.hasPermission(Permission.ATTENDANCE_MANAGE_OTHERS);
    setAttendanceManageOthersPermission(isExist)
  }

  const getDeletePermission = async () => {
    const isExist = await PermissionService.hasPermission(Permission.ATTENDANCE_DELETE);
    setAttendanceDeletePermission(isExist)
    const attendanceCheckinCheckPermission = await PermissionService.hasPermission(Permission.USER_MOBILE_CHECKIN);
    setAttendanceCheckinCheckPermission(attendanceCheckinCheckPermission)
  }

  const attendanceDelete = async () => {
    if (selectedItem) {
      attendanceService.Delete(selectedItem.id, (error, response) => {
        getAttendanceList();
      })
    }
  };

  const checkOut = async (id) => {

    setIsButtonDisabled(true)

    AttendanceService.checkOut(id, () => {

      getAttendanceList();

      setIsButtonDisabled(false)
    })

  }

  const checkOutValidation = async (id) => {
    await AttendanceService.CheckOutValidation(id, async (err, response) => {
      if (response) {
        await checkOut(id)
      }
    })
  }

  const renderItem = data => {
    let item = data?.item;
    let index = data?.index;
    const containerStyle = AlternativeColor.getBackgroundColor(index)

    return (
      <View style={styles.container}>
        <View>
          {item && (
            <TouchableOpacity
              style={[styles.card, containerStyle]}
              disabled={!attendanceManageOthersPermission}
              onPress={() =>
                navigation.navigate("/Attendance/Detail", {
                  attendanceId: item.id,
                })
              }
            >
              <View style={{ flex: 0 }}>
                <View
                  style={{
                    paddingHorizontal: 11,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: "10%"
                  }}
                >
                  {item?.check_in_media_id ? (
                    <Image source={{ uri: item?.check_in_media_id ? item?.check_in_media_id : item.media_url }} style={{ width: 55, height: 55, borderRadius: 30 }} />
                  ) : (
                    <UserAvatar
                      size={55}
                      name={item.userName}
                      bgColor={Color.PRIMARY}
                    />
                  )}

                </View>
              </View>
              <View
                style={{
                  justifyContent: "space-between",
                  paddingVertical: 5,
                  flex: 1,
                }}
              >
                <Text
                  style={{ fontWeight: "700", textTransform: "capitalize" }}
                >
                  {item.userName}
                </Text>
                {item.type !== "Leave" && (<Text>{item.locationName}, {item.shiftName}</Text>)}
                <Text>Date: {DateTime.formatDate(item?.date)}</Text>
                <View style={styles.container1}>
                  {item.type !== "Leave" && (
                    <>
                      <Text style={{ width: '50%' }}>In: {DateTime.LocalTime(item?.login)}
                      </Text>

                      <Text style={{ width: '50%' }}>Out: {DateTime.LocalTime(item?.logout)}
                      </Text>
                    </>
                  )}
                </View>
                <View >
                  {attendanceCheckinCheckPermission && item.type !== "Leave" && !item.logout ?
                    <Button onPress={() => {
                      checkOutValidation(item?.id)
                    }}
                      backgroundColor={Color.RED}
                      title="CHECK OUT"
                    />
                    : <Text></Text>
                  }
                </View>
              </View>
            </TouchableOpacity>

          )}
        </View>
      </View>
    );
  };

  const datepicker = (
    <View style={{ flex: 1, width: '100%' }}>
      <DatePicker
        title={"Select Date"}
        onDateSelect={onDateSelect}
        selectedDate={selectedDate}

      />
    </View>
  )
  const actionItems = [
    <>

      <MenuItem onPress={() => { setIsVisible(true), setApplyLeaveModal(true) }}>
        Apply Leave
      </MenuItem>
    </>
  ];

  return (
    <Layout
      title={"Attendance"}
      isLoading={isLoading}
      refreshing={refreshing}
      actionItems={actionItems}
      showActionMenu={attendanceCheckinCheckPermission}
      bottomToolBar={true}
      closeModal={visible}
      buttonLabel={"CheckIn"}
      buttonOnPress={addNew}
      showActionButton={attendanceCheckinCheckPermission}
    >
      <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>

        <ApplyLeaveModal
          modalVisible={applyLeaveModal}
          toggle={applyleaveToggle}
          button1Label={"APPLY"}
          button2Label={"CANCEL"}
          title={"LEAVE"}
          dateAndTime={datepicker}
          button1Press={applyLeave}
        />
        <DeleteModal
          modalVisible={attendanceDeleteModal}
          toggle={attendanceDeleteToggle}
          updateAction={attendanceDelete}
          id={selectedItem?.id}
        />
        {attendanceList &&
          attendanceList.length > 0 ?
          <>
            <SwipeListView
              data={attendanceList}
              renderItem={renderItem}
              renderHiddenItem={renderHiddenItem}
              rightOpenValue={-70}
              previewOpenValue={-40}
              previewOpenDelay={3000}
              disableRightSwipe={true}
              disableLeftSwipe={attendanceDeletePermission ? false : true}
              closeOnRowOpen={true}
              keyExtractor={item => String(item.id)}
            />
          </>
          : (
            <NoRecordFound iconName="receipt" />
          )}

        <ShowMore List={attendanceList} isFetching={isFetching} HasMore={HasMore} onPress={LoadMoreList} />
      </Refresh>
    </Layout>
  );
};
export default AttendanceList;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    overflow: "scroll",
    backgroundColor: "#fff",
  },
  container1: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
  card: {
    paddingVertical: 5,
    backgroundColor: "#fff",
    borderColor: "#fff",
    elevation: 5,
    flexDirection: "row",
    flex: 1,
},
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
});