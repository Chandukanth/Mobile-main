// Import React and Component
import React, { useState, useEffect, useRef } from "react";

import {
  StyleSheet,
  View,
  BackHandler, StatusBar, NativeModules
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import Header from "./ActionBar";

import Menu from "./NavigationDrawer";

import { useNavigation } from "@react-navigation/native";

import { Keyboard } from "react-native";

import { isLoggedIn } from "../../lib/Helper";

import NetInfo from '@react-native-community/netinfo';

import Spinner from "../Spinner";

import { Color } from "../../helper/Color";

import BottomToolBar from "./bottomToolBar";

import BackGroundFetch from "../BackGroundFetch";

import MessageSound from "../MessageSound";

import settingService from "../../services/SettingService";

import Setting from "../../lib/Setting";

import messageSound from "../../assets/audio/message.mp3";

import * as Notifications from 'expo-notifications';

import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Layout = ({
  children,
  title,
  buttonOnPress,
  buttonLabel,
  showBackIcon,
  backButtonNavigationUrl,
  FooterContent,
  bottomToolBar,
  showScanner,
  openScanner,
  hideFooterPadding,
  Add,
  AddOnPress,
  headerButtonDisabled,
  sync,
  label,
  onNavigate,
  showActionMenu,
  actionItems,
  params,
  updateValue,
  emptyMenu,
  zunomart,
  HideSideMenu,
  isLoading,
  refreshing,
  buttonLabel2,
  button2OnPress,
  closeModal,
  showFilter,
  onFilterPress,
  showMessage,
  filter,
  showActionButton
}) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const [isSideMenuOpen, setSideMenuOpen] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  const { BackgroundFetch } = NativeModules;


  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });
    settingService.get(Setting.MESSAGE_BACKGROUND_FETCH_INTERVAL, async (error, response) => {
      let interval
      if (response && response?.settings && response.settings[0].value) {
        interval = parseInt(response.settings[0].value)
      } else {
        interval = 5
      }
      if (BackgroundFetch) {
        BackGroundFetch(MessageSound, interval);
      }
    })
    getSessionToken();
    const NoInternet = NetInfo.addEventListener(handleConnectivityChange);
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
      NoInternet()
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => backHandler.remove();
  }, []);

  const navigation = useNavigation();

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    }

    return false;
  };

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: messageSound
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    }

    return token;
  }

  const getSessionToken = async () => {
    await isLoggedIn(navigation)
  }

  const handleConnectivityChange = (state) => {
    if (!state.isConnected) {
      navigation.navigate('NoInternet');
    }
  };

  const updateMenuState = (isMenuOpen) => {
    setMenuOpen(isMenuOpen)
    setSideMenuOpen(!isSideMenuOpen);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={Color.ACTION_BAR_BACKGROUND} />

      {isSideMenuOpen ? (
        <Menu
          onItemSelected={"Settings"}
          user={""}
          navigator={navigation}
          isConnected={true}
          setSideMenuOpen={setSideMenuOpen}
          updateMenuState={updateMenuState}
          menuOpen={menuOpen}
        />
      ) : (
        <SafeAreaView style={style.container}>
          <Header
            headerButtonDisabled={headerButtonDisabled}
            updateMenuState={updateMenuState}
            title={title}
            showActionButton={showActionButton}
            buttonLabel={buttonLabel}
            onPress={buttonOnPress}
            showBackIcon={showBackIcon}
            isKeyboardVisible={isKeyboardVisible}
            backButtonNavigationUrl={backButtonNavigationUrl}
            updateValue={updateValue}
            emptyMenu={emptyMenu}
            showScanner={showScanner}
            openScanner={openScanner}
            Add={Add}
            closeModal={closeModal}
            bottomToolBar={bottomToolBar}
            ZunoMart={zunomart}
            AddOnPress={AddOnPress}
            sync={sync}
            params={params}
            HideSideMenu={HideSideMenu}
            label={label}
            onNavigate={onNavigate}
            showActionMenu={showActionMenu}
            showFilter={showFilter}
            showMessage={showMessage}
            actionItems={actionItems}
            buttonLabel2={buttonLabel2}
            button2OnPress={button2OnPress}
            onFilterPress={onFilterPress}
          />

          <View>
            {filter}
          </View>

          {isLoading && !refreshing ? (
            <Spinner />
          ) : (
            <View style={{ flex: 0.9, paddingHorizontal: 10 }}>
              {children}
            </View>
          )}

          {
            FooterContent && (
              <View style={[!hideFooterPadding ? { paddingHorizontal: 10, marginBottom: 10 } : { paddingHorizontal: 0, }]}>
                {FooterContent}
              </View>
            )
          }

          {
            bottomToolBar && (
              <BottomToolBar
                updateMenuState={updateMenuState}
                setSideMenuOpen={setSideMenuOpen}
              />
            )}
        </SafeAreaView>
      )}

    </>
  );
};
export default Layout;

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
    color: Color.RED
  },
});
