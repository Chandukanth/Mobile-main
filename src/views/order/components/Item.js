import React, { useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import ItemEditButton from "../../../components/itemEditButton";

const ItemTile = (props) => {
  const {
    image,
    itemName,
    unitPrice,
    onQuantyChange,
    quantity,
  } = props;
  const [finalPrice, setFinalPrice] = useState(unitPrice * quantity);

  const handleQuantityChange = (value) => {
    onQuantyChange(value);
    setFinalPrice(unitPrice * value);
  }

  return (
    <View style={{ marginTop: 10 }}>
      <View
        style={{
          alignItems: "center",
          borderRadius: 5,
          borderWidth: 1,
          borderColor: "grey",
          padding: 5,
        }}
      >
        <View style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
        }}>

          <View style={{ flex: 0.2 }}>
            <Image
              style={{
                width: 70,
                height: 70,
                resizeMode: "contain",
              }}
              source={{
                uri: image,
              }}
            />
          </View>

          <View style={{ flex: 0.8, paddingLeft: 10 }}>

            <Text style={{ fontWeight: "bold" }}>{itemName}</Text>

            <View style={{ display: "flex", flexDirection: "row" }}>

              <View style={{ flex: 0.9, paddingTop: 2 }}>
             
                <Text >{`Price : ${unitPrice}`}</Text>
             
             </View>

              <ItemEditButton handleClick={handleQuantityChange} val={1}/>

            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ItemTile;
