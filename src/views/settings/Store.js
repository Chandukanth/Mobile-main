// Import React and Component
import React, { useEffect, useState } from "react";

import {
  BackHandler
} from "react-native";

import Layout from "../../components/Layout";

import StoreSelect from "../../components/StoreSelector";

import { useNavigation } from "@react-navigation/native";

import asyncStorageService from "../../services/AsyncStorageService";
import settingService from "../../services/SettingService";
import Setting from "../../lib/Setting";
import AttendanceService from "../../services/AttendanceService";
import DateTime from "../../lib/DateTime";

const StoreSetting = (props) => {

  const [forceCheckInValue, setForceCheckInValue] = useState("")

  const [attendance, setAttendance] = useState([])

  const params = props?.route?.params;

  const navigation = useNavigation();

  useEffect(() => {
    forceCheckIn()
    if (params?.isInitialSetup) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => { return true },
      );
      return () => backHandler.remove();
    }
  }, []);

  const forceCheckIn = async () => {
    let userId = await asyncStorageService.getUserId()
    let RoleId = await asyncStorageService.getRoleId()
    await settingService.get(Setting.FORCE_CHECK_IN_AFTER_LOGIN, async (error, response) => {
      setForceCheckInValue(response && response.settings && response.settings[0].value)
    }, RoleId)
    let attendance = { user: userId, startDate: DateTime.formatDate(new Date()), endDate: DateTime.toISOEndTimeAndDate(new Date()) }
    AttendanceService.getAttendanceList(null, attendance, (error, response) => {
      setAttendance(response)
    });
  }

  const onStorePress = async (store) => {
    await asyncStorageService.setSelectedLocationName(store.name);
    await asyncStorageService.setSelectedLocationId(JSON.stringify(store.id))

    if (params?.isInitialSetup) {
      if (forceCheckInValue === "true" && attendance.length == 0) {
        navigation.navigate("shiftSelect", {
          showAllowedShift: true,
          redirectionUrl: "Dashboard",
          navigation: navigation,
          forceCheckIn: true
        })
      } else {
        navigation.navigate("Dashboard", { login: true });
      }
    } else {
      navigation.navigate("Settings");
    }
  }

  return (
    <Layout
      title="Select Location"
      HideSideMenu={params?.isInitialSetup ? true : false}
      emptyMenu={params?.isInitialSetup ? true : false}
      defaultFooter={true}
    >
      <StoreSelect onPress={onStorePress} />
    </Layout>
  );
};

export default StoreSetting;