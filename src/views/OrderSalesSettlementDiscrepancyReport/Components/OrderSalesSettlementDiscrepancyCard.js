import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import CurrencyText from "../../../components/CurrencyText";
import StoreText from "../../../components/StoreText";
import UserCard from "../../../components/UserCard";
import DateText from "../../../components/DateText";
import Label from "../../../components/Label";

const OrderSalesSettlementDiscrepancyCard = (props) => {
  const {
    firstName,
    lastName,
    date,
    location,
    alternative,
    shift,
    totalSaleCash,
    totalOrderCash,
    totalOrderUpi,
    totalSaleUpi,
    total_discrepancy_upi,
    total_discrepancy_cash,
    total_draft_order_amount,
    item,
  } = props;

  return (
    <TouchableOpacity
      key={item}
      activeOpacity={1.2}
      style={[styles.container, alternative]}
    >
      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <DateText date={date} />
        </View>
        <Text numberOfLines={1}>
          <StoreText locationName={location} />, {shift}
        </Text>
        <View style={styles.ownerContainer}>
          <UserCard firstName={firstName} lastName={lastName} />
        </View>

        <View style={styles.row}>
          <View style={styles.leftColumn}>
            <View style={styles.row}>
              <Label text="SalesCash:" size={14} />
              <CurrencyText amount={totalSaleCash} />
            </View>

            <View style={styles.row}>
              <Label text="OrderCash:" size={14} />
              <CurrencyText amount={totalOrderCash} />
            </View>
            <View style={styles.row}>
              <Label text="TotalCash:" size={14} />
              <CurrencyText amount={total_discrepancy_cash} />
            </View>
          </View>
          <View style={styles.rightColumn}>
            <View style={styles.row}>
              <Label text="SalesUpi:" size={14} />
              <CurrencyText amount={totalSaleUpi} />
            </View>
            <View style={styles.row}>
              <Label text="OrderUpi:" size={14} />
              <CurrencyText amount={totalOrderUpi} />
            </View>
            <View style={styles.row}>
              <Label text="TotalUpi:" size={14} />
              <CurrencyText amount={total_discrepancy_upi} />
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <Label text="Total Draft Order Amount:" size={14} />
          <CurrencyText amount={total_draft_order_amount} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderSalesSettlementDiscrepancyCard;

const styles = StyleSheet.create({
  ownerContainer: {
    flexDirection: "row",
  },
  container: {
    alignItems: "flex-start",
    paddingBottom: 10,
    paddingTop: 10,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 1,
  },
  row: {
    flexDirection: "row",
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 1,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  locationText: {
    flex: 1,
    marginRight: 5,
    fontSize: 14,
    fontWeight: "bold",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  shiftText: {
    fontSize: 14,
  },
});
