import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DateTime from "../../../lib/DateTime";
import { Color } from "../../../helper/Color";
import UserCard from "../../../components/UserCard";
import IdText from "../../../components/IdText";
import DateText from "../../../components/DateText";
const StockEntryCard = (props) => {
  const {
    stock_entry_number,
    store,
    date,
    firstName,
    lastName,
    status,
    onPress,
  } = props;
  return (
    <TouchableOpacity activeOpacity={1.2} style={styles.container} onPress={onPress}>
      <View style={styles.infoContainer}>
        <Text>
          <IdText id={stock_entry_number} />
          <DateText
              date={DateTime.UTCtoLocalTimeAndMmmFormat(date)}/>
        </Text>
        <Text style={styles.store}>{store}</Text>
        <View style={styles.ownerContainer}>
          <UserCard firstName={firstName} lastName={lastName}/>
        </View>
      </View>
      <View style={[styles.statusContainer,{backgroundColor:status === "Completed" ? Color.COMPLETE :
Color.GREY}]}>
        <Text
          style={[
            styles.statusText,
            status === "Completed" && styles.completedStatus,
            status === "Draft" && styles.draftStatus,
            
          ]}
        >
          {status}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default StockEntryCard;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 100,
    borderRadius: 15,
    backgroundColor: Color.WHITE,
    elevation: 8,
    marginTop: 13,
    marginLeft: 3,
    marginRight: 3,
    padding: 15,
    marginBottom:2,
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoContainer: {
    flex: 1,
    marginLeft:1,
  },
  stockNumber: {
    fontWeight: "bold",
    fontSize: 14,
    color: "black",
  },
  store: {
    fontSize: 15,
    marginBottom: 5,
    color: "black",
  },
  ownerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ownerName: {
    marginLeft: 4,
    fontSize: 14,
  },
  date: {
    fontSize: 14,
    color: "gray",
    fontWeight: "bold",
  },
  rightAlign: {
    textAlign: "right",
    flex: 1,
  },
  statusContainer: {
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginLeft: 9,
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 11,
  },
  completedStatus: {
    color: "white",
  },
  draftStatus: {
    color: "white",
  },
  
});