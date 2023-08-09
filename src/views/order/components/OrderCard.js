import React from "react";
import { View, Text,TouchableOpacity, StyleSheet } from "react-native";
import DateTime from "../../../lib/DateTime";
import Status from "../../../components/Status";
import IdText from "../../../components/IdText";
import DateText from "../../../components/DateText";
import CurrencyText from "../../../components/CurrencyText";
import AlternativeColor from "../../../components/AlternativeBackground";
import StoreText from "../../../components/StoreText";

const OrderCard = (props) => {
  const { order_number, shift, status, locationName,statusColor, total_amount,payment_type, date, onPress, index,text } = props;



  const containerStyle = AlternativeColor.getBackgroundColor(index)
  return (
    <TouchableOpacity style={[styles.align, containerStyle]} onPress={onPress}>
      <View style={{ flex: 1 }}>
        <Text>
        <IdText id={order_number} />
        <DateText date={DateTime.formatedDate(date)}/>
        </Text>
        <Text>
          <StoreText locationName={locationName} />
           , {shift}
        </Text>
        <Text>
        <Text>{payment_type}</Text>
        <CurrencyText amount={total_amount} />
        </Text>
        </View>
        <Status
          status={status} backgroundColor={statusColor}
        />
    </TouchableOpacity>
  );
};

export default OrderCard;
const styles = StyleSheet.create({

  containerview: {
      flex: 1,
      overflow: "scroll",
      backgroundColor: "#fff",
    },
      align:{
        alignItems: "flex-start",
        paddingBottom: 10,
        paddingTop: 10,
      },
  })
