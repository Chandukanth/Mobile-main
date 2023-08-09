import React, { useState, useEffect } from "react";
import storeService from "../services/StoreService";
import Select from '../components/Select'
import { useIsFocused } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";




const StoreSelect = (props) => {
  const { name, data, label, onChange, disable, divider, showBorder, control: controlProp } = props
  const [storeList, setLocationList] = useState([]);
  const [selectedLocationId, setStoreId] = useState(selectedLocationName);
  const [selectedLocationName, setStoreName] = useState(selectedLocationId);
  const isFocused = useIsFocused();
  const navigation = useNavigation();


  useEffect(() => {
    getStoreList();

  }, [isFocused]);

  const {
    control,
    formState: { errors },
  } = useForm({
  });

  const getStoreList = () => {
    storeService.list((error, response) => {
      const storeListOption = new Array();
      let storeList = response?.data?.data;
      if (storeList && storeList.length > 0) {
        for (let i = 0; i < storeList.length; i++) {
          storeListOption.push({
            label: storeList[i].name,
            value: storeList[i].id,
          });
        }

        setLocationList(storeListOption);
      }

    });
  }

  return (
    <Select
      control={controlProp ? controlProp : control}
      options={storeList}
      OnSelect={onChange}
      label={label}
      name={name}
      divider={divider}
      showBorder={showBorder}
      placeholder={"Select Location"}
      data={data}
      disable={disable}
    />
  )
};
export default StoreSelect;
