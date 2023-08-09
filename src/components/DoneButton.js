import React from 'react';
import { View, Button } from "react-native";
import { Color } from '../helper/Color';


const DoneButton = (props) => {
    return (
        <Button title={"Done"} color={Color.DONE_BUTTON} onPress={props.onPress} />
    )
}

export default DoneButton