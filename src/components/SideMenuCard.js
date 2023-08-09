import React, { useEffect, useState } from "react";

import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";

import { Color } from "../helper/Color";

import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import RightArrow from "./RightArrow";

const IconCard = (props) => {
  const { onPress, Icon, name, MaterialCommunityIcon, dashboardValue, backgroundColor } = props;

  
  return (
    <View
      style={styles.container}
    >
      <TouchableOpacity
        onPress={onPress}
        style={[styles.sheetContainer, { backgroundColor: backgroundColor }]}
        accessibilityLabel={name}
      >
        <View style={styles.Icon}>
          {!MaterialCommunityIcon ?
            <FontAwesome5 name={Icon} size={17} color={Color.PRIMARY} /> : <MaterialCommunityIcons name={Icon} size={17} color={Color.PRIMARY} />}
        </View>

        <Text
          style={styles.TextStyles}
          accessibilityLabel="settingsTitle"
        >
          {name}
        </Text>
        <RightArrow/>
      </TouchableOpacity>
    </View>

  );
};

export default IconCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  Icon: {
    borderRadius: 2,
    flex: 0.12,
    padding: 5
  },
  TextStyles: {
    fontSize: 16,
    fontWeight: "400",
    color: Color.PRIMARY,
    padding: 10,
    flex: 0.7,
    justifyContent: 'flex-start'
  },
  sheetContainer: {
    flexDirection: "row",
    flex: 2,
    paddingHorizontal: 10,
    alignItems: "center"
  }
});