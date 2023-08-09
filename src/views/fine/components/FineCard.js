import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTime from "../../../lib/DateTime";
import { Color } from "../../../helper/Color";
import UserCard from "../../../components/UserCard";
import Label from "../../../components/Label";
import Status from "../../../components/Status";
import { Fine } from "../../../helper/Fine";
import DateText from "../../../components/DateText";
import IdText from "../../../components/IdText";
import CurrencyText from "../../../components/CurrencyText";
const FineCard = (props) => {
  const {
    date, user, type, amount, id, onPress, alternative, status, statusColor
  } = props;
  return (
    <TouchableOpacity activeOpacity={1.2} style={[styles.container, alternative]} onPress={onPress}>
      <View style={styles.infoContainer}>

      <View style={styles.row}>
        {id && (
        <IdText id={id} />
        )}
          <DateText date={DateTime.formatDate(date)}/>

        </View>
        <View style={styles.row}>
          <Text>
            {type}
          </Text>
          <CurrencyText amount={amount}/>
        </View>
        <View style={styles.ownerContainer}>
          <UserCard firstName={user}/>
        </View>
        </View>
        {status && (
        <Status
          status={status} backgroundColor={statusColor}
        />
        )}

    </TouchableOpacity>
  );
};
export default FineCard;
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
