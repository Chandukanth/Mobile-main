// Import React and Component
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Button
} from "react-native";

// icons
import { MaterialIcons } from "@expo/vector-icons";
import Currency from "../lib/Currency";
import ImageCard from "./ImageCard";

import { Color } from "../helper/Color";
import Order from "../helper/Order";
import StatusService from "../services/StatusServices";


const ProductCard = (props) => {
  const {
    onPress,
    name,
    image,
    brand,
    sale_price,
    mrp,
    size,
    unit,
    quantity,
    item,
    search,
    QuantityField,
    noIcon,
    disabled,
    status,
    statusUpdate,
    alternative,
  } = props;

  const [productStatus, setProductStatus] = useState([])

  useEffect(() => {
    if (item?.currentStatusId) {
      getNextStatus();
    }
  }, [statusUpdate])

  const getNextStatus = async () => {
    let nextStatusList = await StatusService.getNextStatus(item.currentStatusId, null);
    if (nextStatusList) {
      setProductStatus(nextStatusList);
    }
  }
  return (
    <TouchableOpacity
      style={[
        alternative ? alternative : styles.card,
        !noIcon && { elevation: 5 },
        QuantityField && search ? { paddingHorizontal: 20 } : "",
      ]}
      disabled={disabled}
      activeOpacity={QuantityField ? 1 : 0.4}
      onPress={() => onPress && onPress(item)}
    >
      <View style={{ paddingRight: 20, flex: 0.15 }}>
        <ImageCard ImageUrl={image} />
      </View>
      <View
        style={[
          styles.container,
          QuantityField ? { flex: 0.65 } : { flex: 0.85 },
        ]}
      >
        {brand ? <Text style={{ fontWeight: "700" }}>{brand}</Text> : ""}
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.cartText]}>
            {name}
            {size ? ", " + size : ""}
            {unit}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          {sale_price ? (
            mrp != sale_price && mrp > 0 ? (
              <View style={{ flexDirection: "row" }}>
                <Text style={{ textDecorationLine: "line-through" }}>
                  {Currency.IndianFormat(mrp)}
                </Text>
                {mrp > 0 && mrp != sale_price ? (
                  <Text style={{ paddingLeft: 10, fontWeight: 'bold' }}>
                    {Currency.IndianFormat(sale_price)}
                  </Text>
                ) : (
                  ""
                )}
              </View>
            ) : (
              <Text>{Currency.IndianFormat(sale_price)}</Text>
            )
          ) : (
            <Text>{Currency.IndianFormat(mrp)}</Text>
          )}
          {status && (
            <Text style={{ color: status === Order.STATUS_CANCEL ? Color.RED : Color.SECONDARY }}>{` (${status})`}</Text>
          )}

        </View>
        {productStatus && productStatus.length > 0 && statusUpdate && (
          <View style={styles.buttonContainer}>
            {productStatus.map((status, index) => {
              return (
                <View key={status.id} style={{ width: productStatus.length == 1 ? '100%' : productStatus.length == 2 ? '50%' : '50%', marginRight: index !== productStatus.length - 1 ? 1 : 0 }}>
                  <Button
                    title={status.name}
                    color={status.color_code}
                    onPress={() => statusUpdate && statusUpdate(status.status_id, item.inventoryTransferProductId)}
                  />
                </View>
              );
            })}
          </View>
        )}


      </View>

      {QuantityField ? (
        <>
          <View style={{ justifyContent: "center", flex: 0.25, alignItems: "flex-end" }}>
            <Text style={{ fontWeight: "500", fontSize: 16, color: "gray" }}>
              {quantity}
            </Text>
          </View>

        </>
      ) : (
        !noIcon && <MaterialIcons name="chevron-right" size={30} color="gray" />
      )}

    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "#fff",
    flexDirection: "row",
    flex: 1,
  },
  cartText: {
    fontSize: 16,
    textTransform: "capitalize",
  },

  quantityBox: {
    flex: 0.3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderColor: "black",
    borderRadius: 3,
    borderWidth: 1,
  },

  container: {
    paddingVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
    alignContent: 'space-between'
  },
});
