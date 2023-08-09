import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Color } from "../../../helper/Color";
import Status from "../../../components/Status";
import IdText from "../../../components/IdText";
import DateText from "../../../components/DateText";
import CurrencyText from "../../../components/CurrencyText";
import UserCard from "../../../components/UserCard";


const SaleSettlementCard = (props) => {
  const { saleSettlementNumber, shift, alternative, status, locationName, item, total_amount, date, onPress, salesExecutive } = props;

  return (
    <TouchableOpacity activeOpacity={1.2} style={[styles.align,alternative]} onPress={onPress}>
      <View style={{ flex: 1 }}>
        <Text>
        <IdText id={saleSettlementNumber} />
        <DateText date={date} />
        </Text>
        <Text>
          {locationName}, {shift}
        </Text>
          <UserCard
            name={salesExecutive}
            firstName={salesExecutive}
          />
        <CurrencyText amount={total_amount} />
        </View>

        <Status
          status={status} backgroundColor={Color.GREY}
        />


    </TouchableOpacity>
  );
};

export default SaleSettlementCard;

const styles = StyleSheet.create({

  align:{
    alignItems: "flex-start",
    paddingBottom: 10,
    paddingTop: 10,
  },
  })