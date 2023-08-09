import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native";
import Status from "../../../components/Status";
import DateText from "../../../components/DateText";
import IdText from "../../../components/IdText";

import CurrencyText from "../../../components/CurrencyText";
import DateTime from "../../../lib/DateTime";
import AlternativeColor from "../../../components/AlternativeBackground";
const BillCard =(props)=>{
    const {accountName,date,status,amount,statusColor,onPress,billingName,billNumber,index}=props
    const containerStyle = AlternativeColor.getBackgroundColor(index)

    return(
      <TouchableOpacity style={[styles.align, containerStyle]} onPress={onPress}>
      <View style={{ flex: 1 }}>
        <Text>
          <IdText id ={billNumber}/>
        <DateText date={DateTime.formatDate(date)}/>
        </Text>
        <Text>
           {accountName}
        </Text>
        <Text numberOfLines={1}>{billingName}</Text>
        <CurrencyText amount={amount} />
        </View>
        <Status
          status={status} backgroundColor={statusColor}
        />
    </TouchableOpacity>
  );
};

export default BillCard;
const styles = StyleSheet.create({

  containerview: {
      flex: 1,
      overflow: "scroll",
      backgroundColor: "#fff",
    },
      align:{
        alignItems: "flex-start",
        paddingBottom: 8,
        paddingTop: 8,
      },
  })

