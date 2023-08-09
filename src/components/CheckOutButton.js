import React from 'react';
import { View, Button } from "react-native";
import { Color } from '../helper/Color';

const CheckOutButton = (props) => {
    return (
        <Button title={"Check Out"} color={Color.RED} onPress={props.onPress} disabled={props.disabled}/>
    )
}

export default CheckOutButton