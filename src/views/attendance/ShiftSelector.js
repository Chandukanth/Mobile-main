// Import React and Component
import React, { useState, useEffect } from "react";

import Layout from "../../components/Layout";

import { StyleSheet, BackHandler } from "react-native";

import { useIsFocused } from "@react-navigation/native";

import ShiftService from "../../services/ShiftService";

import ShiftList from "../../components/ShiftList";

import Media from "../../helper/Media";

import AttendanceService from "../../services/AttendanceService";

import SpinnerOverlay from "react-native-loading-spinner-overlay";
import { Color } from "../../helper/Color";

const ShiftSelector = (props) => {
  const [shiftList, setShiftList] = useState([]);

  const isFocused = useIsFocused();

  const [isLoading, setIsLoading] = useState(false);

  const [image, setImage] = useState("");

  const [overlayLoader, setOverlayLoader] = useState(null);


  let params = props?.route?.params;

  useEffect(() => {
    getShiftList();
  }, [isFocused]);


  useEffect(() => {
    const getMedia = async () => {
      setOverlayLoader(true);
      let imageData = await Media.getImage();
      while (imageData.canceled) {
        imageData = await Media.getImage();
      }
      setImage(imageData);
      setOverlayLoader(false);
    };

    getMedia();
  }, []);


  useEffect(() => {
    if (params?.forceCheckIn) {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          return true;
        }
      );
      return () => backHandler.remove();
    }
  }, []);

  const getShiftList = () => {
    //create new rray
    let shiftListOption = new Array();

    setIsLoading(true);

    ShiftService.getShiftList(
      { showAllowedShift: params.showAllowedShift },
      (error, response) => {
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

        setIsLoading(false);
      }
    );
  };

  const onShiftSelect = async (selectedShift) => {
    if (selectedShift) {
      AttendanceService.CheckIn(
        selectedShift.value,
        setIsLoading,
        params.navigation,
        params.redirectionUrl,
        image
      );
    }
  };

  return (
    <>
      {image.assets && (
        <Layout
          title="Select Shift"
          showBackIcon={!params?.forceCheckIn}
          isLoading={isLoading}
        >
          <ShiftList
            shiftList={shiftList}
            onPress={onShiftSelect}
            setIsLoading={setIsLoading}
          />
        </Layout>
      )}
      <SpinnerOverlay
        visible={overlayLoader}
        textContent={"Loading Please Wait ..."}
        textStyle={{ color: "#fff" }}
        color={Color.WHITE}
      />
    </>
  );
};

export default ShiftSelector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "scroll",
    backgroundColor: "#fff",
  },
  containers: {
    height: 60,
    backgroundColor: "#fff",
    borderColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
  },
});
