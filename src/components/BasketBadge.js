import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import basket from "../assets/footerLayout/basketBlack.png";

//this component to is displayt the number of items in basket
export const BasketBadge = (props) => {
  const { basketCount } = props;
  return (
    <>
      <View>
        <Image style={{ width: 25, height: 25 }} source={basket} />
        <View style={styles.countBadge}>
          <Text style={{ color: "#fff" }}>{basketCount}</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  countBadge: {
    height: 20,
    width: 20,
    borderRadius: 50,
    backgroundColor: "#fc5203",
    position: "absolute",
    top: -10,
    left: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
