import React from "react";
import { Text } from 'react-native';
import { Color } from "../helper/Color";
const IdText = (props) => {
    const { id } = props

    return (

        <Text style={{color:Color.GREY}}>
            {`#${id} `} 
        </Text>
    )
}
export default IdText