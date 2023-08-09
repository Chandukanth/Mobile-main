import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CurrencyText from "../../../components/CurrencyText";
import DateText from "../../../components/DateText";
import IdText from "../../../components/IdText";
import Status from "../../../components/Status";
import Label from "../../../components/Label";


const PurchaseCard = (props) => {
    const { item, navigation, alternative } = props;

    return (
        <TouchableOpacity activeOpacity={1.2} style={[styles.align, alternative]} onPress={() => {
            navigation.navigate("PurchaseForm", { item })
        }}  >
            <View style={{ flex: 1 }}>
                <Text>
                    <IdText id={item?.purchaseNumber} />
                    <DateText date={item?.purchaseDate} />
                </Text>
                <Label text={item.vendorName} bold={true} />

                <CurrencyText amount={item?.net_amount} />
            </View>

            <Status
                status={item?.statusName} backgroundColor={item?.statusColor}
            />
        </TouchableOpacity>
    );
};

export default PurchaseCard;

const styles = StyleSheet.create({

    align:{
      alignItems: "flex-start",
      paddingBottom: 10,
      paddingTop: 10,
    },
    })