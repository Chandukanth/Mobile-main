import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Button,
} from "react-native";


import Currency from "../../../lib/Currency";

import { Color } from "../../../helper/Color";

const OrderListFooterContent = ({ Cash, totalAmount, Paytm }) => {

  return (
    <View style={{  flex : 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          paddingTop: 20,
        }}
      >
        <View style={{ borderWidth: 0.3, borderColor: Color.WHITE, width: "50%", padding: 10, backgroundColor:Color.ACTIVE }}>
          <Text style={{ fontWeight: "bold", fontSize: 14, color:Color.BLACK }}>
            Cash&nbsp;
            <Text style={{ color: Color.BLACK }}>
              {Currency.IndianFormat(Cash)}
            </Text>
          </Text>
        </View>
        <View style={{ borderWidth: 0.3, padding: 10, borderColor: Color.WHITE, width: "50%", backgroundColor:Color.ACTIVE}}>
          <Text style={{ fontWeight: "bold", fontSize: 14, alignItems: "flex-start",  color:Color.BLACK  }}>
            Paytm&nbsp;
            <Text style={{ color: Color.BLACK }}>
              {Currency.IndianFormat(Paytm)}
            </Text>
          </Text>
        </View>
      </View>
      <View
        style={{
          alignItems: "center",
          borderWidth: 0.3,
          padding: 8,
          borderColor: Color.WHITE,
          backgroundColor:Color.ACTIVE
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 18,  color:Color.BLACK }}>
          TotalAmount&nbsp;
          <Text style={{ color: Color.BLACK }}>
            {Currency.IndianFormat(totalAmount)}
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default OrderListFooterContent;
