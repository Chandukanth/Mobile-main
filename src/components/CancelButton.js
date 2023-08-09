import React from 'react';
import { Color } from '../helper/Color'; 
import Button from './Button';

const CancelButton = (props) => {
    return (
        <Button title={"Cancel"} backgroundColor={Color.SAVE_BUTTON} onPress={props.onPress} />
    )
}

export default CancelButton