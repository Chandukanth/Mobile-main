import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  onIncrease,
  onDecrease,
} from "react-native";

export const EditQuantity = (props) => {
  const { initialCount, onChange, onIncrease, onDecrease } = props;
  const [count, setCount] = useState(initialCount);
  //the function called when the quantity is edited.
  const onEdit = (countChange) => {
    // To check if count is increased or decreased
    if (countChange >= 0) {
      if (countChange > count) {
        onIncrease(countChange);
      } else {
        onDecrease(countChange);
      }

      setCount(countChange);
      onChange(countChange);
    }
  };
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: count > 0 ? "space-between" : "space-around",
        alignItems: "center",
        paddingVertical: 5,
        width: "20%",
        height: 40,
        borderWidth: 1,
        borderRadius: 30,
      }}
    >
      {count > 0 ? (
        <TouchableOpacity
          onPress={() => {
            onEdit(count - 1);
          }}
        >
          <Text style={styles.editButton}>-</Text>
        </TouchableOpacity>
      ) : (
        <></>
      )}

      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        {count > 0 ? count : "ADD"}
      </Text>

      <TouchableOpacity
        onPress={() => {
          onEdit(count + 1);
        }}
      >
        <Text style={styles.editButton}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  editButton: {
    fontSize: 20,
    fontWeight: "bold",
    width: 25,
    textAlign: "center",
  },
});
