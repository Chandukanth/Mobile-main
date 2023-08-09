import React from "react";
import { Color } from "../helper/Color";
import { Button, View, Text } from "react-native";

const LoadMoreButton = (props) => {
  const { onPress, disabled } = props;
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,
      }}
    >
      <Text style={{
        fontSize: 20,
        color: Color.LOAD_MORE,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
      }}
        onPress={onPress}
        disabled={disabled}
      >Show More</Text>
    </View>
  );
};

export default LoadMoreButton;
