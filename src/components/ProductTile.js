import React from "react";
import { View, Text, Image } from "react-native";
import { EditQuantity } from "./EditQuantity";

export const ProductTile = (props) => {
  const { image, name, quantity, price, initialCount, onChange } = props;
  return (
    <>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          justifyContent: "space-between",
          alignItems: "center",
          // height: "100%",
          // width: "100%",
          // backgroundColor: "red",
          paddingVertical: 5,
          // marginTop: 5,
          // marginHorizontal: 25,
          marginBottom: 10,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",

            // backgroundColor: "red",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              style={{
                width: 70,
                height: 70,
                resizeMode: "contain",
              }}
              source={image}
            />
            <View style={{ marginLeft: 20 }}>
              <Text style={{ fontWeight: "bold" }}>{name}</Text>
              <Text>{quantity}</Text>
              <Text style={{ fontWeight: "bold" }}>{price}</Text>
            </View>
          </View>
        </View>
        {/* To increase or decrease the product count  */}
        <EditQuantity
          initialCount={initialCount}
          onChange={(c) => {
            onChange(c);
          }}
        />
      </View>
    </>
  );
};
