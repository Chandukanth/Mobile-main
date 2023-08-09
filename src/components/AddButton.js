import React from 'react';
import { Color } from '../helper/Color';
import Button from './Button';
const AddButton = (props) => {
    const { onPress, data } = props
    return(
        <Button title = {data ? "UPDATE":"ADD"} backgroundColor={Color.PRIMARY} onPress = {onPress}/>
    )
}

export default AddButton