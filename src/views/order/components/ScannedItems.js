import React from "react";
import { StyleSheet, View, Text, Image, Button } from "react-native";
import ActionBarButton from "../../../components/ActionBarButton";
import { Color } from "../../../helper/Color";
import Item from "./Item";

const ScannedItems = (props) => {
  const { totalItems, totalCost, setTotalCost, scannedItems, setScannedItems } =
    props;
  return (
    <>
    <View style={{ padding: 5, marginTop: 10 }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text>{`TOTAL: ${totalCost}`}</Text>
        <Text>{`TOTAL ITEMS: ${totalItems}`}</Text>
      </View>

      {scannedItems.map((item, index) => (
        <Item
          image={item.url}
          itemName={item.name}
          unitPrice={item.sale_price}
          onQuantyChange={(count) => {
            let scannedItemsList = scannedItems;
            scannedItemsList[index].quantity = count;
            setScannedItems(scannedItemsList);
            setTotalCost(count * item.sale_price);
          } }
          quantity={item.quantity} />
      ))}
      {scannedItems.length<0 ?
         <View style={{ marginTop: 5 }}>
        <ActionBarButton title="Complete" color={Color.PRIMARY}/>
      </View>:""}
    </View>
 
      </>
  );
};

const styles = StyleSheet.create({});

export default ScannedItems;
