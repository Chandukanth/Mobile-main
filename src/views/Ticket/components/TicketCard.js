import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import DateText from "../../../components/DateText";
import UserCard from "../../../components/UserCard";
import DateTime from "../../../lib/DateTime";
import { useNavigation } from "@react-navigation/native";
import Status from "../../../components/Status";
import IdText from "../../../components/IdText"


const TicketCard = (props) => {
  const { eta, summary, assignee_name,ticket_number, alternative, status, statusColor,avatarUrl, onPress } = props;

  return (
    <TouchableOpacity style={[styles.container, alternative]} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.user}>
          <View style={styles.align}>
            <UserCard firstName={assignee_name} size={20} image ={avatarUrl}/>
          </View>
          <View style={styles.status}>
            <Status status={status} backgroundColor={statusColor} />
          </View>
        </View>
        <View style={styles.eta}>
          <DateText date={DateTime.formatDate(eta)} />
        </View>
        <View style={styles.summary}>
          <Text numberOfLines={2}>
            <IdText id={ticket_number}/>: {summary}
          </Text>
        </View>
      </View>

    </TouchableOpacity>
  );
};

export default TicketCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },

  row: {
    alignItems: "flex-start",
    marginTop: 6,
    marginBottom: 6,
  },
  user: {
    width: "100%",
    flexDirection: "row",
  },
  summary: {
    flexDirection: "row",
    paddingLeft: 27,
    paddingBottom: 3,
    maxWidth: "100%"
  },
  status: {
    width: "35%"
  },
  align: {
    width: "65%"
  },
  eta: {
    paddingLeft: 26,
  },
});
