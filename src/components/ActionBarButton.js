import React from 'react';
import { Color } from '../helper/Color';
import { Button } from "react-native";
const ActionButton = (props) => {
    const {title, onPress, disabled } = props
    return(
        <Button title = {title} color={Color.ACTION_BAR_BUTTON} disabled = {disabled} onPress = {onPress}/>
    )
}

export default ActionButton