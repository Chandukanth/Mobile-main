import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AlternativeColor from "../../../components/AlternativeBackground";
import OrderReportService from "../../../services/OrderReportService";

const ReportCard = (props) => {
  const [data, setData] = useState([]);
  const [userName, setUserName] = useState();

  useEffect(() => {
    getOrderReport();
  }, []);

  const getOrderReport = async () => {
    await OrderReportService.search({}, (response) => {
      let data = response?.data?.data;
      setData(data);
      setUserName(response?.data?.user_name);
    });
  };

  const styles = StyleSheet.create({
    card: {
      flexDirection: "row",
      marginLeft: 0,
      marginRight: 0,
      marginBottom: 2,
      alignItems: "center",
      justifyContent: "space-between",
      height: 60,
    },
    monthText: {
      fontSize: 16,
      textTransform: "capitalize",
      color: "black",
    },
    nameText: {
      fontSize: 16,
      fontWeight: "bold",
      textTransform: "capitalize",
      color: "black",
    },
    amountText: {
      fontWeight: "bold",
      fontSize: 14,
      color: "green",
    },
    evenRow: {
      backgroundColor: "white",
    },
    oddRow: {
      backgroundColor: "gray",
    },
  });

  return (
    <View>
      {data &&
        data.length > 0 &&
        data.map((data, index) => (
          <View
            key={index}
            style={[styles.card, AlternativeColor.getBackgroundColor(index)]}>
            <View>
              <Text style={styles.nameText}>{userName}</Text>
              <Text style={styles.monthText}>{data?.date}</Text>
            </View>
            <Text style={styles.amountText}>₹{data?.amount}</Text>
          </View>
        ))}
    </View>
  );
};

export default ReportCard;
