import React from 'react';
import { View, Button } from "react-native";
import CheckInButton from './CheckInButton';
import CheckOutButton from './CheckOutButton';

const FooterButtons = (props) => {
    const { onPressCheckIn, onPressCheckOut } = props
    return (
        <View style={{ flex: 1, flexDirection: "row", marginTop: 10 }}>
            <View style={{ flex: 0.5, justifyContent: "flex-end", alignItems: "center" }}>
                <View style={{ width: "100%", }}>
                    <CheckOutButton onPress={onPressCheckOut} />

                </View>
            </View>


            <View style={{ flex: 0.5, justifyContent: "center", alignItems: "center", marginLeft: 2 }}>
                <View style={{ width: "100%", }}>
                    <CheckInButton onPress={onPressCheckIn} />

                </View>
            </View>

        </View>
    )
}

export default FooterButtons