import React from "react";
import { Text, View } from "react-native";
import Label from "./Label";
const Required = ({title, required}) => {
    return (
        <View style={{ flexDirection: 'row'}}>
            {title && <Label text={title} bold={true}/>}
            {title && required && <Text style={{ color: 'red' }}>*</Text>}
        </View>
    )
}
export default Required