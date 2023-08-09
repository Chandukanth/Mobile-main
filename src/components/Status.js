import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Color } from "../helper/Color";

const Status = (props) => {
    const { status,backgroundColor } = props
    return (
      <View>
        <View style={[styles.statusContainer, {
            backgroundColor: backgroundColor ?  backgroundColor:"black" 
          }]}>
            <Text
              style={[
                styles.statusText]}
            >
              {status}
            </Text>
          </View>
          </View>
      );
    };
    
    export default Status;
    
    const styles = StyleSheet.create({

        statusContainer: {
          borderRadius: 5,
          paddingVertical: 4,
          paddingHorizontal: 15,
          marginLeft: 9,
        },
        statusText: {
          fontWeight: "bold",
          fontSize: 11,
          color : Color.WHITE,
          textAlign:"center"
        },
        });