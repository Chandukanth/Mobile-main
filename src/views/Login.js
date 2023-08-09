// Import React and Component
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Image
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import arrowIcon from "../assets/left-arrow.png";

import platform from "../lib/Platform";

import apiClient from "../apiClient";

import { endpoints } from "../helper/ApiEndPoint";

import TextInput from "../components/Text";

import AsyncStorageConstants from "../helper/AsyncStorage";

import Toast from "react-native-toast-message";

import PermissionService from "../services/UserRolePermissionService";

import OnePortalDB from "../db/onePortalDB";

import SignInButton from "../components/SignInButton";

import { useNavigation } from "@react-navigation/native";

import { Color } from "../helper/Color";

import Alert from "../components/Modal/Alert";

import Device from "../lib/Device";

import UserDeviceInfoService from "../services/UserDeviceInfoService";

import { version } from '../../package.json';

import storeService from "../services/StoreService";

import Validation from "../lib/Validation";

import PortalLogo from "../assets/PortalLogo.png";

import asyncStorageService from "../services/AsyncStorageService";

import Layout from "../components/Layout/LoginLayout";

import AsyncStorageService from "../services/AsyncStorageService";
import settingService from "../services/SettingService";
import Setting from "../lib/Setting";
import Button from "../components/Button";
import StatusServices from "../services/StatusServices";
import VerticalSpace from "../components/VerticleSpace10";

import SyncService from "../services/SyncService";
import Label from "../components/Label";

const Login = ({ }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [IpAddress, setIpAddress] = useState("");
  const [brandName, setBrandName] = useState("");
  const [battery, setBattery] = useState("");
  const [network, setNetwork] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [appVersion, setAppVersion] = useState("");
  const [uniqueId, setUniqueId] = useState("");


  const navigation = useNavigation();

  useEffect(() => {
    GetDeviceInformation();
  }, [])

  useEffect(() => {
    (async () => {
      const sessionToken = await AsyncStorageService.getSessionToken()
      const storeId = await AsyncStorageService.getSelectedLocationId();

      if (!sessionToken) {
        navigation.navigate("Login");
      } else if (sessionToken && !storeId) {
        navigation.navigate("Settings/SelectStore", {
          isInitialSetup: true
        });
      } else if (sessionToken && storeId) {
        navigation.navigate("Dashboard");
      }
    })();
  }, []);



  const getPermissionList = () => {
    PermissionService.getPermissionList(async (error, response) => {
      //validate response data exist or not
      if (response?.data?.data) {
        //get permission list
        let permissionList = response?.data?.data;

        //validate permission list
        if (permissionList && Array.isArray(permissionList)) {
          //convert JSON into string
          permissionList = JSON.stringify(permissionList);
          //set in local storag
          await asyncStorageService.setPermissions(permissionList)
        }
      }
    })
  }


  const GetDeviceInformation = async () => {
    await Device.GetIpAddress((callback) => setIpAddress(callback))
    await Device.NetWorkStatus((callback) => setNetwork(callback))
    await Device.GetDeviceName((callback) => setDeviceName(callback))
    await Device.GetDeviceBrandName((callback) => setBrandName(callback))
    await Device.GetBatteryPercentage((callback) => setBattery(callback))
    await Device.getUniqueId((callback) => setUniqueId(callback))

    setAppVersion(version)
  }

  const Login = async () => {
    try {
      if (!email || !password) {
        Alert.Error(!email && !password ? "Email or Mobile Number and Password is required" : !password ? "Password is required" : "Email or Mobile Number is required")
      } else {
        if (isNaN(email.charAt(0))) { // check if the first character is not a number (i.e. email)
          if (!Validation.isValidEmail(email)) {
            Alert.Error("Email is invalid")
          }
        } else { // first character is a number (i.e. mobile number)
          if (!Validation.isValidMobileNumber(email)) {
            Alert.Error("Mobile Number is invalid")
          }
        }
      }

      if (Validation.isValidEmail(email) || Validation.isValidMobileNumber(email)) {
        if (email && password) {

          let data = { email: email.toLowerCase(), password: password };

          apiClient.post(
            `${endpoints().UserAPI}/loginByPassword`,
            data, async (error, response) => {
              if (response && response.data && response.data.user) {

                let role = response?.data?.user ? response.data.user.role.toString() : ""

                let userId = response?.data?.user ? response.data.user.id.toString() : ""

                let token = response?.data?.user ? response.data.user.token.toString() : "";

                let firstName = response?.data?.user?.firstName ? response?.data?.user?.firstName : "";

                let lastName = response?.data?.user?.lastName ? response?.data?.user?.lastName : ""

                let name = `${firstName} ${lastName}`

                await asyncStorageService.setSessionToken(token)

                await asyncStorageService.setUserName(name)

                await asyncStorageService.setRoleId(role);

                await asyncStorageService.setUserId(userId)

                getPermissionList();

                await OnePortalDB.create();

                let bodyData = {
                  ipAddress: IpAddress,
                  deviceName: deviceName,
                  brandName: brandName,
                  network: network,
                  battery: battery,
                  unique_id:uniqueId,
                  user: response.data.user.id,
                  versionNumber: appVersion
                }
                UserDeviceInfoService.create(bodyData, (error, response) => { console.log(error) })


                //sync product index data
                await settingService.get(Setting.AFTER_LOGIN_SHOW_STORE_SELECTION, async (error, response) => {

                  if (response?.settings && response.settings.length > 0 && response.settings[0].value === "true") {

                    await storeService.GetStoreByIpAddress(async (err, response) => {

                      if (response && response.data && response.data.id) {
                        asyncStorageService.setSelectedLocationName(response.data.name)
                        asyncStorageService.setSelectedLocationId(JSON.stringify(response.data.id))
                        await navigation.navigate("Dashboard", { login: true });
                        setPassword("");
                        setEmail("");
                      } else {
                        await navigation.navigate("Settings/SelectStore", {
                          isInitialSetup: true
                        });
                        setPassword("");
                        setEmail("");
                      }
                    });
                  } else {
                    navigation.navigate("Dashboard");
                  }
                })
              } else {
                Alert.Error(
                  "Invalid Password");
              }

            }
          );

        }
      }
    } catch (error) {
      if (error) {
        let errorMessage;
        const errorRequest = error.response.request;
        if (errorRequest && errorRequest.response) {
          errorMessage = JSON.parse(errorRequest.response).message;
          let responseError = error.response.data.message
          Alert.Error(
            responseError);
        }
      }
    }
  };

  const EmailFieldOnChange = (value) => {
    setEmail(value);
  };

  const PasswordFieldOnChange = (value) => {
    setPassword(value);
  };
  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };
  return (
    <Layout>
      <KeyboardAvoidingView
        style={[
          styles.container,
          {
            flexDirection: "column",
          },
        ]}
      >


        <View style={{ flex: platform.isIOS() ? 2.2 : 1, alignContent: 'space-around', justifyContent: 'center' }}>

          <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 170 }}>
            <Label text="Login" fontWeight={`400`} size={20} color={Color.BLACK} />
          </View>
          <VerticalSpace paddingBottom={30} />
          <TextInput
            placeholder="Email/Mobile"
            name={"email"}
            onChange={EmailFieldOnChange}
            value={email}
          />

          <TextInput
            placeholder="Password"
            name={"password"}
            onChange={PasswordFieldOnChange}
            secureTextEntry={true}
            value={password}
          />

          <Button title="Log In" onPress={() => Login()} />
          <Text style={styles.forgotPassword} onPress={handleForgotPassword}>
            Forgot Password?
          </Text>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              marginBottom: 30,
            }}
          >
          </View>
        </View>
      </KeyboardAvoidingView>
    </Layout>
  );
};
export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  SectionStyle: {
    flexDirection: "row",
    height: 40,
    marginTop: 20,
  },
  buttonStyle: {
    backgroundColor: Color.PRIMARY,
    borderWidth: 0,
    color: Color.PRIMARY,
    borderColor: Color.PRIMARY,
    padding: 3,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
    width: 320,
    fontWeight: 'bold'
  },
  inputStyle: {
    flex: 1,
    color: "black",
    paddingLeft: 15,
    paddingRight: 15,
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#dadae8",
  },
  registerTextStyle: {
    color: "black",
    textAlign: "center",
    fontSize: 14,
    alignSelf: "center",
    padding: 10,
  },
  forgotPassword: {
    color: "black",
    fontSize: 14,
    alignSelf: "flex-end",
    marginTop: 20,
  },
  singInText: {
    color: "black",
    fontSize: 14,
  },
  welcomeText: {
    color: "black",
    fontSize: 30,
    fontWeight: "bold",
    paddingVertical: 10,
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
  forgotPassword: {
    color: "blue",
    textDecorationLine: "underline",
    marginTop: 10,
    paddingBottom: 20,
    textAlign: 'right',
  },

});
