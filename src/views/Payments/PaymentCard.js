import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTime from "../../lib/DateTime";
import UserCard from "../../components/UserCard";
import Status from "../../components/Status";
import DateText from "../../components/DateText";
import IdText from "../../components/IdText";
import CurrencyText from "../../components/CurrencyText";
const PaymentCard = (props) => {
  const {
   item,
   onPress,
   alternative
  } = props;
  return (
    <TouchableOpacity activeOpacity={1.2} style={[styles.container, alternative]} onPress={onPress}>
      <View style={styles.infoContainer}>

      <View style={styles.row}>
        <IdText id={item.payment_number} />
          <DateText date={DateTime.formatDate(item.date)}/>

        </View>
        <View style={styles.row}>
          <CurrencyText amount={item.amount}/>
        </View>
        <View style={styles.ownerContainer}>
          <UserCard firstName={item.first_name} lastName={item.last_name} image={item?.url} />
        </View>
        </View>
        <Status
          status={item.status} backgroundColor={item.statusColor}
        />

    </TouchableOpacity>
  );
};
export default PaymentCard;
const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    paddingBottom: 10,
    paddingTop: 10,
  },
  row : {
    flexDirection: "row" 
  },
  infoContainer: {
    flex: 1,
    marginLeft: 1,
},
ownerContainer: {
  flexDirection: "row",
  alignItems: "center",
},
})
