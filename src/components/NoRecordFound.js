import React from 'react';
import { Color } from '../helper/Color';
import { View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Label from './Label';

const NoRecordFound = (props) => {
  const { iconName, styles, message } = props
  return (
    <View style={styles ? styles : { paddingVertical: 250, alignItems: "center"}}>
      <FontAwesome5 name={iconName} size={20} color={Color.PRIMARY} />
      <Label text={ message ? message : "No Records Found"} bold={true} />
    </View>)
}

export default NoRecordFound 