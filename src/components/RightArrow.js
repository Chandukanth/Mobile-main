import React from "react";
import { View, StyleSheet } from "react-native";
import { Color } from "../helper/Color";
import { MaterialIcons } from "@expo/vector-icons";

const RightArrow = () => {
    return (
      <View style={styles.container}>
      <MaterialIcons name="chevron-right" size={30} color={Color.RIGHT_ARROW} />
    </View>
      );
    };
    
    export default RightArrow;
    
    const styles = StyleSheet.create({
      container: {
        flex: 0.5,
        alignItems: 'flex-end',
        paddingRight:10
      },
    });
    
   
    
    
    