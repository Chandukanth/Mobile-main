// Import React and Component
import React, { useState, useEffect } from "react";

import Layout from "../../components/Layout";

import { View, ScrollView } from "react-native";

import AttendanceFormComponent from "./components/AttendanceForm";

import StoreService from "../../services/StoreService";

import UserService from "../../services/UserService";

import ShiftService from "../../services/ShiftService";

import { useIsFocused } from "@react-navigation/native";

import AttendanceService from "../../services/AttendanceService";

import { useNavigation } from "@react-navigation/native";

import Permission from "../../helper/Permission";

import AsyncStorage from "../../lib/AsyncStorage";

import AsyncStorageConstants from "../../helper/AsyncStorage";

import Spinner from "../../components/Spinner";

import ActionBarButton from "../../components/ActionBarButton";

import dateTime from "../../lib/DateTime";

const AttendanceForm = (props) => {

    const [storeList, setStoreList] = useState([]);

    const [userList, setUserList] = useState([]);

    const [shiftList, setShiftList] = useState([]);

    const [selectedUser, setSelectedUser] = useState([]);

    const [selectedStore, setSelectedStore] = useState([]);

    const [selectedShift, setSelectedShift] = useState([]);

    const [manageOther, setManageOther] = useState(false);

    const [isStoreLading, setStoreLoading] = useState("");

    const [isUserListLoading, setUserLoading] = useState("");

    const [isShiftLoading, setShiftLoading] = useState(false);

    const [selelctedDate, setSelectedDate] = useState(new Date());

    const [selectedInTime, setSelectedInTime] = useState(new Date());

    const [selectedOutTime, setSelectedOutTime] = useState("");

    const [attendanceDetail, setAttendanceDetail] = useState("");


    //get focused 
    const isFocused = useIsFocused();

    //get navigation object
    const navigation = useNavigation();

    //route params
    let params = props?.route?.params;

    useEffect(() => {
        //get required values
        getRequiredValues();
    }, [isFocused, props])

    useEffect(() => {
        //get permission
        getPermission();
    }, [userList])

    useEffect(() => {
        //get permission
        updateAttendanceDetail();
    }, [attendanceDetail, storeList, shiftList, userList])


    useEffect(() => {
        getAttendanceDetail();
    }, [props, isFocused])

    const updateAttendanceDetail = () => {
        if (attendanceDetail) {
            setSelectedDate(attendanceDetail?.date ? new Date(attendanceDetail?.date) : "");
            setSelectedInTime(attendanceDetail?.login ? new Date(attendanceDetail?.login) : "");
            setSelectedOutTime(attendanceDetail?.logout ? new Date(attendanceDetail?.logout) : "");

            if (userList && userList.length > 0) {
                let selectedUser = userList.find((data) => data.id == attendanceDetail.user_id);
                setSelectedUser(selectedUser);
            }

            if (storeList && storeList.length > 0) {
                let selectedStore = storeList.find((data) => data.value == attendanceDetail.store_id);
                setSelectedStore(selectedStore);
            }

            if (shiftList && shiftList.length > 0) {
                let selectedShift = shiftList.find((data) => data.value == attendanceDetail.shift_id);
                setSelectedShift(selectedShift)
            }
        }
    }

    const getAttendanceDetail = () => {
        if (params?.attendanceId) {
            AttendanceService.getAttendanceDetail(navigation, params?.attendanceId, (error, response) => {
                if (response && response.data && response.data.data) {
                    setAttendanceDetail(response.data.data);
                }
            })
        }
    }

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
                    permissionList.find((option) => option.role_permission === Permission.ATTENDANCE_MANAGE_OTHERS)
                    ? true
                    : false;

                //set all user
                setManageOther(manageOther)

                //validate show all user exist or not
                if (!manageOther && !params?.attendanceId) {
                    //validate user list exist or not
                    if (userList && userList.length > 0) {
                        //get user Id from async storage
                        let user_id = await AsyncStorage.getItem(
                            AsyncStorageConstants.USER_ID
                        );
                        //validate user Id exist or not
                        if (user_id) {
                            //get selected user data
                            let selectedUserData = userList.find((data) => data.value == user_id);
                            //set selected User Data
                            setSelectedUser(selectedUserData);
                        }

                    }
                }
            }
        }
    }

    const getRequiredValues = () => {

        //declare store list option
        const storeListOption = new Array();
        //declare user list option
        const userListOption = new Array();
        //declare shift list option
        const shiftListOption = new Array();

        setStoreLoading(true);
        StoreService.list((error, response) => {
            //get store list
            let storeList = response?.data?.data;
            //validate store list exist or not
            if (storeList && storeList.length > 0) {
                //loop the store list
                for (let i = 0; i < storeList.length; i++) {
                    //push the store list
                    storeListOption.push({
                        label: storeList[i].name,
                        value: storeList[i].id,
                    });
                }
                //set store list
                setStoreList(storeListOption);
            }
            setStoreLoading(false);

        });

        //get user list
        UserService.getList((err, response) => {
            
                setUserList(response);
            
        })

        setShiftLoading(true);
        //get shift list
        ShiftService.getShiftList(null, (error, response) => {
            //validate shift list exist or nott
            let shiftList = response?.data?.data;
            //validate shift list
            if (shiftList && shiftList.length > 0) {
                //loop the shift list
                for (let i = 0; i < shiftList.length; i++) {
                    //push the shift list
                    shiftListOption.push({
                        label: shiftList[i].name,
                        value: shiftList[i].id,
                    });
                }
                //set the shift list
                setShiftList(shiftListOption);
            }
            setShiftLoading(false);
        })
    };

    const onUserChange = (value) => {
        setSelectedUser(value);
    }

    const onStoreChange = (value) => {
        setSelectedStore(value);
    }

    const onShiftChange = (value) => {
        setSelectedShift(value);
    }

    const onInTimeChange = (value) => {

        let Intime = dateTime.TimeUpdate(value, selelctedDate);

        setSelectedInTime(Intime)
    }

    const onOutTimeChange = (value) => {

        let outTime = dateTime.TimeUpdate(value, selelctedDate);

        setSelectedOutTime(outTime);
    }

    const onDateSelect = (value) => {

        setSelectedDate(value)

        let Intime = dateTime.DateUpdate(value, selectedInTime);

        let OutTime = dateTime.DateUpdate(value, selectedOutTime);

        setSelectedInTime(Intime)

        setSelectedOutTime(OutTime);
    }

    const handleSubmit = () => {
        if (params?.attendanceId) {
            checkOut()
        } else {
            let bodyData = {
                user: selectedUser?.value,
                type: "Working Day",
                store: selectedStore?.value,
                shift: selectedShift?.value,
            }
            if (selelctedDate) {
                bodyData.date = selelctedDate;
            }


            if (selectedInTime) {
                bodyData.login = selectedInTime;
            }


            if (selectedOutTime) {
                bodyData.logout = selectedOutTime;
            }

            if (bodyData) {
                AttendanceService.AddAttendance(navigation, bodyData, (error, response) => {
                    if (response) {
                        setSelectedUser("");
                        setSelectedStore("");
                        setSelectedShift("");
                        navigation.navigate("Attendance")
                    }
                });
            }
        }
    }

    const checkOut = () => {
        if (params?.attendanceId) {
            let bodyData = {
                user: selectedUser?.value ? selectedUser?.value : attendanceDetail?.user_id,
                date: selelctedDate ? selelctedDate : attendanceDetail?.date,
                shift: selectedShift ? selectedShift.value : attendanceDetail?.shift_id
            }

            if (selectedInTime) {
                bodyData.login = selectedInTime;
            }

            if (selectedOutTime && manageOther) {
                bodyData.logout = selectedOutTime;
            } else if (!manageOther) {
                bodyData.logout = new Date();
            }

            AttendanceService.updateAttendance(navigation, params?.attendanceId, bodyData, (error, response) => {
                if (response) {
                    navigation.navigate("Attendance")
                }
            })
        }
    }

    if (isStoreLading || isUserListLoading || isShiftLoading) {
        return <Spinner />
    }

    return (
        <Layout title={"Attendance"} showBackIcon={true}>
            <ScrollView>
                <AttendanceFormComponent
                    shiftList={shiftList}
                    userList={userList}
                    storeList={storeList}
                    onUserChange={onUserChange}
                    onStoreChange={onStoreChange}
                    onShiftChange={onShiftChange}
                    selectedUser={selectedUser}
                    manageOther={manageOther}
                    selectedDate={selelctedDate}
                    selectedInTime={selectedInTime}
                    selectedOutTime={selectedOutTime}
                    onInTimeChange={onInTimeChange}
                    onOutTimeChange={onOutTimeChange}
                    onDateSelect={onDateSelect}
                    selectedStore={selectedStore}
                    selectedShift={selectedShift}
                />

                <View style={{ marginTop: 10 }}>
                    <ActionBarButton disabled={attendanceDetail?.logout ? true : false} title={params?.attendanceId ? "Check Out" : "Check In"} onPress={() => handleSubmit()} />
                </View>
            </ScrollView>
        </Layout>
    )
}

export default AttendanceForm;