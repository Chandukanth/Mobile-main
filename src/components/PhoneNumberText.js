import React from "react";
import { Text, View } from 'react-native';
const PhoneNumber = (props) => {
    const { phoneNumber } = props
    return (
        <View >
        <Text> {phoneNumber}</Text>
        </View>
    )
}
export default PhoneNumber