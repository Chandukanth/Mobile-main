import React from "react";

import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";

import { Color } from "../helper/Color";

import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

const IconCard = (props) => {
  const { onPress, Icon, name, styles, TextStyles, MaterialCommunityIcon, outOfStock } = props;
  return (
    <View style={{ borderRadius: 2, padding: 5, }}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles ? styles : { alignItems: 'center' }}>
          {!MaterialCommunityIcon ?

            <FontAwesome5 name={Icon} size={50} color={Color.PRIMARY} /> : <MaterialCommunityIcons name={Icon} size={50} color={Color.PRIMARY} />}
        </View>

        <Text style={TextStyles ? outOfStock ? { marginLeft: 20 } : { marginLeft: 5 } : { justifyContent: 'center', alignItems: 'center' }}>{name}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default IconCard;


