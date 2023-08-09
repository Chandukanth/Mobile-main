import React from "react";
import { View, StyleSheet } from "react-native";

const VerticalSpace10 = ({ paddingTop, paddingBottom }) => {
  return (
    <View
      style={{
        paddingTop: paddingTop ? paddingTop : 10,
        paddingBottom: paddingBottom ,
      }}
    />
  );
};

export default VerticalSpace10;
