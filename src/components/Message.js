import React, { useState, useEffect } from 'react';
import { Color } from '../helper/Color';
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation,useRoute } from '@react-navigation/native';
import {StyleSheet,TouchableOpacity, View } from 'react-native';



const Message = () => {

    const navigation = useNavigation();

const handleMessagePress = () => {

     navigation.navigate("Messages")
};
  const route = useRoute();
  const routeNameArray = route.name.split('/');
  const menuItemValue = routeNameArray[0];
   return(
    <TouchableOpacity onPress={handleMessagePress} style={{ marginRight: 20,paddingTop:10 }}>
              <View style={{ alignItems: "center" }}>
              <FontAwesome5
                      name="envelope"
                      size={24}
                      color={menuItemValue === "Messages" ? Color.BLUE : Color.TOOL_BAR}
                  />
              </View>
          </TouchableOpacity>
   )
}

export default Message;
